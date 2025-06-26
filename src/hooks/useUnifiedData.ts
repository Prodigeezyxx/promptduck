
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
  
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [autoSyncCompleted, setAutoSyncCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Unified prompts - combines local and cloud data with fallbacks
  const allPrompts = user ? (cloudPrompts.length > 0 ? cloudPrompts : localPrompts) : localPrompts;
  
  // Unified generations - combines local and cloud data with fallbacks
  const allGenerations = user ? (cloudGenerations.length > 0 ? cloudGenerations : localHistory) : localHistory;

  // Auto-sync when user authenticates (only once per session)
  useEffect(() => {
    if (user && !syncing && !autoSyncCompleted && !cloudLoading) {
      performAutoSync();
    }
  }, [user, autoSyncCompleted, cloudLoading]);

  const createContentHash = (content: string, title: string) => {
    return btoa(content + title).replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
  };

  const performAutoSync = async () => {
    if (!user || syncing || autoSyncCompleted) return;
    
    setSyncing(true);
    setError(null);
    
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
      setError('Failed to sync data. Using local data as fallback.');
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
          console.log(`Skipping duplicate prompt: ${localPrompt.title}`);
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

    // Sync generations (with basic deduplication)
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
    try {
      if (user) {
        // Check for duplicates before saving to cloud
        const contentHash = createContentHash(prompt.content, prompt.title);
        const existingPrompt = cloudPrompts.find(p => {
          const existingHash = createContentHash(p.content, p.title);
          return existingHash === contentHash || (p.title === prompt.title && p.content === prompt.content);
        });

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
    syncing: syncing || cloudLoading,
    lastSyncTime,
    performAutoSync,
    error
  };
}
