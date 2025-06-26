
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { usePromptStore } from '@/store/promptStore';
import { useGeneratorStore } from '@/store/generatorStore';
import { useSupabasePrompts } from './useSupabasePrompts';
import { useSupabaseGenerations } from './useSupabaseGenerations';
import { Prompt, GenerationResult } from '@/types';

export function useUnifiedData() {
  const { user } = useAuthContext();
  const { prompts: localPrompts, setPrompts: setLocalPrompts, addPrompt: addLocalPrompt } = usePromptStore();
  const { history: localHistory, setHistory: setLocalHistory, addToHistory: addLocalGeneration } = useGeneratorStore();
  const { 
    prompts: cloudPrompts, 
    savePrompt: saveCloudPrompt,
    refreshPrompts
  } = useSupabasePrompts();
  const { 
    generations: cloudGenerations, 
    saveGeneration: saveCloudGeneration 
  } = useSupabaseGenerations();
  
  const [error, setError] = useState<string | null>(null);

  // Show data immediately - no blocking
  const allPrompts = user ? cloudPrompts : localPrompts;
  const allGenerations = user ? cloudGenerations : localHistory;

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
      if (user) {
        // Simple save without duplicate checking (let database handle it)
        return await saveCloudPrompt(prompt);
      } else {
        addLocalPrompt(prompt);
        return null;
      }
    } catch (error) {
      console.error('Failed to save prompt:', error);
      if (user) {
        addLocalPrompt(prompt);
      }
      throw error;
    }
  };

  const saveGeneration = async (result: GenerationResult, intent: string, context?: string) => {
    try {
      if (user) {
        await saveCloudGeneration(result, intent, context);
      } else {
        addLocalGeneration(result);
      }
    } catch (error) {
      console.error('Failed to save generation:', error);
      if (user) {
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
    syncing: false,
    lastSyncTime: null,
    performAutoSync: async () => {},
    error
  };
}
