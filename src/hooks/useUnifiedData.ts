import { useState } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { usePromptStore } from '@/store/promptStore';
import { useGeneratorStore } from '@/store/generatorStore';
import { useSupabasePrompts } from './useSupabasePrompts';
import { useSupabaseGenerations } from './useSupabaseGenerations';
import { Prompt, GenerationResult } from '@/types';

export function useUnifiedData() {
  const { user } = useAuthContext();
  const { prompts: localPrompts, addPrompt: addLocalPrompt } = usePromptStore();
  const { history: localHistory, addToHistory: addLocalGeneration } = useGeneratorStore();
  const { 
    prompts: cloudPrompts, 
    savePrompt: saveCloudPrompt,
    isInitialized: promptsInitialized
  } = useSupabasePrompts();
  const { 
    generations: cloudGenerations, 
    saveGeneration: saveCloudGeneration,
    isInitialized: generationsInitialized 
  } = useSupabaseGenerations();
  
  const [error, setError] = useState<string | null>(null);

  const isRealUser = user && !(user as any).isGuest;

  // Show data immediately - prompts are preloaded in background
  const allPrompts = isRealUser ? cloudPrompts : localPrompts;
  const allGenerations = isRealUser ? cloudGenerations : localHistory;

  // For loading states, only show loading if user is authenticated but data isn't initialized yet
  const isLoading = isRealUser && !promptsInitialized;

  // Process prompts for better descriptions without changing functionality
  const processedPrompts = allPrompts.map(prompt => {
    if (!prompt.description || prompt.description === 'AI Generated Prompt' || prompt.description.trim() === '') {
      const contentLines = prompt.content.split('\n').filter(line => line.trim());
      const firstMeaningfulLine = contentLines.find(line => 
        !line.startsWith('#') && 
        !line.includes('Context:') && 
        !line.includes('Role:') &&
        line.length > 20
      );
      
      return {
        ...prompt,
        description: firstMeaningfulLine?.slice(0, 100) + '...' || prompt.title || 'Custom prompt'
      };
    }
    return prompt;
  });

  const savePrompt = async (prompt: Omit<Prompt, 'id' | 'created_at' | 'updated_at' | 'version' | 'usage_count'>) => {
    try {
      if (isRealUser) {
        return await saveCloudPrompt(prompt);
      } else {
        addLocalPrompt(prompt);
        return null;
      }
    } catch (error) {
      console.error('Failed to save prompt:', error);
      if (isRealUser) {
        addLocalPrompt(prompt);
      }
      throw error;
    }
  };

  const saveGeneration = async (result: GenerationResult, intent: string, context?: string) => {
    try {
      if (isRealUser) {
        await saveCloudGeneration(result, intent, context);
      } else {
        addLocalGeneration(result);
      }
    } catch (error) {
      console.error('Failed to save generation:', error);
      if (isRealUser) {
        addLocalGeneration(result);
      }
      throw error;
    }
  };

  return {
    prompts: processedPrompts,
    generations: allGenerations,
    savePrompt,
    saveGeneration,
    syncing: isLoading,
    lastSyncTime: null,
    performAutoSync: async () => {},
    error
  };
}
