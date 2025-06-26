
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { usePromptStore } from '@/store/promptStore';
import { useGeneratorStore } from '@/store/generatorStore';
import { useSupabasePrompts } from './useSupabasePrompts';
import { useSupabaseGenerations } from './useSupabaseGenerations';
import { Prompt, GenerationResult } from '@/types';

export function useUnifiedData() {
  const { user } = useAuthContext();
  const { prompts: localPrompts, setPrompts: setLocalPrompts } = usePromptStore();
  const { history: localHistory, setHistory: setLocalHistory } = useGeneratorStore();
  const { 
    prompts: cloudPrompts, 
    savePrompt: saveCloudPrompt,
    refreshPrompts 
  } = useSupabasePrompts();
  const { 
    generations: cloudGenerations, 
    saveGeneration: saveCloudGeneration 
  } = useSupabaseGenerations();
  
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Unified prompts - combines local and cloud data
  const allPrompts = user ? cloudPrompts : localPrompts;
  
  // Unified generations - combines local and cloud data  
  const allGenerations = user ? cloudGenerations : localHistory;

  // Auto-sync when user authenticates
  useEffect(() => {
    if (user && !syncing) {
      performAutoSync();
    }
  }, [user]);

  const performAutoSync = async () => {
    if (!user || syncing) return;
    
    setSyncing(true);
    try {
      console.log('Starting automatic data sync...');
      
      // First refresh cloud data to get latest
      await refreshPrompts();
      
      // Sync local prompts to cloud
      await syncPromptsToCloud();
      
      // Sync local generations to cloud
      await syncGenerationsToCloud();
      
      setLastSyncTime(new Date());
      console.log('Auto-sync completed successfully');
    } catch (error) {
      console.error('Auto-sync failed:', error);
      // Don't throw - sync should be resilient
    } finally {
      setSyncing(false);
    }
  };

  const syncPromptsToCloud = async () => {
    if (!user || localPrompts.length === 0) return;
    
    console.log(`Syncing ${localPrompts.length} local prompts to cloud...`);
    
    for (const localPrompt of localPrompts) {
      try {
        // Check if prompt already exists in cloud (avoid duplicates)
        const existsInCloud = cloudPrompts.some(cloudPrompt => 
          cloudPrompt.title === localPrompt.title && 
          cloudPrompt.content === localPrompt.content
        );
        
        if (!existsInCloud) {
          await saveCloudPrompt({
            title: localPrompt.title,
            description: localPrompt.description,
            content: localPrompt.content,
            category: localPrompt.category,
            persona: localPrompt.persona,
            tags: localPrompt.tags,
            heuristics: localPrompt.heuristics || [],
            variables: localPrompt.variables || [],
            difficulty: localPrompt.difficulty || 'intermediate',
            estimatedTime: localPrompt.estimatedTime || '15 minutes',
            parent_id: localPrompt.parent_id
          });
          console.log(`Synced prompt: ${localPrompt.title}`);
        }
      } catch (error) {
        console.error(`Failed to sync prompt ${localPrompt.title}:`, error);
      }
    }
  };

  const syncGenerationsToCloud = async () => {
    if (!user || localHistory.length === 0) return;
    
    console.log(`Syncing ${localHistory.length} local generations to cloud...`);
    
    for (const generation of localHistory) {
      try {
        await saveCloudGeneration(generation, 'Auto-synced from local storage');
        console.log(`Synced generation: ${generation.preview_title || 'Untitled'}`);
      } catch (error) {
        console.error('Failed to sync generation:', error);
      }
    }
  };

  const savePrompt = async (prompt: Omit<Prompt, 'id' | 'created_at' | 'updated_at' | 'version' | 'usage_count'>) => {
    if (user) {
      // Save to cloud for authenticated users
      return await saveCloudPrompt(prompt);
    } else {
      // Save to local storage for unauthenticated users
      const localStore = usePromptStore.getState();
      localStore.addPrompt(prompt);
      return null;
    }
  };

  const saveGeneration = async (result: GenerationResult, intent: string, context?: string) => {
    if (user) {
      // Save to cloud for authenticated users
      await saveCloudGeneration(result, intent, context);
    } else {
      // Save to local storage for unauthenticated users
      const localStore = useGeneratorStore.getState();
      localStore.addToHistory(result);
    }
  };

  return {
    prompts: allPrompts,
    generations: allGenerations,
    savePrompt,
    saveGeneration,
    syncing,
    lastSyncTime,
    performAutoSync
  };
}
