
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
    refreshPrompts,
    loading: cloudLoading 
  } = useSupabasePrompts();
  const { 
    generations: cloudGenerations, 
    saveGeneration: saveCloudGeneration 
  } = useSupabaseGenerations();
  
  const [error, setError] = useState<string | null>(null);

  // Unified prompts - cloud takes priority when available and user is authenticated
  const allPrompts = user ? cloudPrompts : localPrompts;
  
  // Unified generations - cloud takes priority when available and user is authenticated
  const allGenerations = user ? cloudGenerations : localHistory;

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
    prompts: allPrompts,
    generations: allGenerations,
    savePrompt,
    saveGeneration,
    syncing: cloudLoading,
    lastSyncTime: null,
    performAutoSync: async () => {}, // No-op, migration handles this
    error
  };
}
