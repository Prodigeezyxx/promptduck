
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
  const [autoSyncCompleted, setAutoSyncCompleted] = useState(false);

  // Unified prompts - combines local and cloud data
  const allPrompts = user ? cloudPrompts : localPrompts;
  
  // Unified generations - combines local and cloud data  
  const allGenerations = user ? cloudGenerations : localHistory;

  // Auto-sync when user authenticates (only once per session)
  useEffect(() => {
    if (user && !syncing && !autoSyncCompleted) {
      performAutoSync();
    }
  }, [user, autoSyncCompleted]);

  const createContentHash = (content: string, title: string) => {
    return btoa(content + title).replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
  };

  const performAutoSync = async () => {
    if (!user || syncing || autoSyncCompleted) return;
    
    setSyncing(true);
    try {
      console.log('Starting automatic data sync...');
      
      // First refresh cloud data to get latest
      await refreshPrompts();
      
      // Only sync if we have local data that's not already in the cloud
      if (localPrompts.length > 0 || localHistory.length > 0) {
        await syncDataToCloud();
      }
      
      setLastSyncTime(new Date());
      setAutoSyncCompleted(true);
      console.log('Auto-sync completed successfully');
    } catch (error) {
      console.error('Auto-sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  const syncDataToCloud = async () => {
    if (!user) return;
    
    let syncedPrompts = 0;
    let syncedGenerations = 0;
    
    // Create hash set for existing cloud prompts
    const existingHashes = new Set();
    cloudPrompts.forEach(prompt => {
      const hash = createContentHash(prompt.content, prompt.title);
      existingHashes.add(hash);
    });

    // Sync prompts with deduplication
    for (const localPrompt of localPrompts) {
      try {
        const contentHash = createContentHash(localPrompt.content, localPrompt.title);
        
        // Skip if duplicate exists
        if (existingHashes.has(contentHash)) {
          continue;
        }

        // Check for exact duplicates
        const exactDuplicate = cloudPrompts.some(cloudPrompt => 
          cloudPrompt.title === localPrompt.title && 
          cloudPrompt.content === localPrompt.content
        );
        
        if (!exactDuplicate) {
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
          
          existingHashes.add(contentHash);
          syncedPrompts++;
          console.log(`Synced prompt: ${localPrompt.title}`);
        }
      } catch (error) {
        console.error(`Failed to sync prompt ${localPrompt.title}:`, error);
      }
    }

    // Sync generations
    for (const generation of localHistory) {
      try {
        await saveCloudGeneration(generation, 'Auto-synced from local storage');
        syncedGenerations++;
        console.log(`Synced generation: ${generation.preview_title || 'Untitled'}`);
      } catch (error) {
        console.error('Failed to sync generation:', error);
      }
    }

    console.log(`Sync completed: ${syncedPrompts} prompts, ${syncedGenerations} generations`);
  };

  const savePrompt = async (prompt: Omit<Prompt, 'id' | 'created_at' | 'updated_at' | 'version' | 'usage_count'>) => {
    if (user) {
      // Check for duplicates before saving
      const contentHash = createContentHash(prompt.content, prompt.title);
      const existingPrompt = cloudPrompts.find(p => {
        const existingHash = createContentHash(p.content, p.title);
        return existingHash === contentHash || (p.title === prompt.title && p.content === prompt.content);
      });

      if (existingPrompt) {
        console.log('Prompt already exists, skipping save');
        return existingPrompt;
      }

      return await saveCloudPrompt(prompt);
    } else {
      const localStore = usePromptStore.getState();
      localStore.addPrompt(prompt);
      return null;
    }
  };

  const saveGeneration = async (result: GenerationResult, intent: string, context?: string) => {
    if (user) {
      await saveCloudGeneration(result, intent, context);
    } else {
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
