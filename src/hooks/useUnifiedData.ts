
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

  // Enhanced unified prompts - always show available data
  const allPrompts = user ? cloudPrompts : localPrompts;

  // Enhanced unified generations - always show available data
  const allGenerations = user ? cloudGenerations : localHistory;

  // Enhanced prompt processing to handle existing prompts with generic descriptions
  const processedPrompts = allPrompts.map(prompt => {
    // If description is generic, try to extract meaningful intent from content or title
    if (!prompt.description || prompt.description === 'AI Generated Prompt' || prompt.description.trim() === '') {
      // Try to extract intent from the beginning of the content
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
        // Check for duplicates before saving to cloud
        const existingPrompt = cloudPrompts.find(p => 
          p.title === prompt.title && p.content === prompt.content
        );

        if (existingPrompt) {
          console.log('Prompt already exists in cloud, skipping save');
          return existingPrompt;
        }

        return await saveCloudPrompt(prompt);
      } else {
        // For unauthenticated users, save to local storage
        addLocalPrompt(prompt);
        return null;
      }
    } catch (error) {
      console.error('Failed to save prompt:', error);
      // Fallback to local storage if cloud save fails
      if (user) {
        console.log('Falling back to local storage');
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
      // Fallback to local storage if cloud save fails
      if (user) {
        console.log('Falling back to local storage for generation');
        addLocalGeneration(result);
      }
      throw error;
    }
  };

  return {
    prompts: processedPrompts, // Return processed prompts with better descriptions
    generations: allGenerations,
    savePrompt,
    saveGeneration,
    syncing: false, // No blocking syncing
    lastSyncTime: null,
    performAutoSync: async () => {}, // No-op
    error
  };
}
