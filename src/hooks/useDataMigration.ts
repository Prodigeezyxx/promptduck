
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { usePromptStore } from '@/store/promptStore';
import { useGeneratorStore } from '@/store/generatorStore';
import { useSupabasePrompts } from './useSupabasePrompts';
import { useSupabaseGenerations } from './useSupabaseGenerations';
import { toast } from '@/hooks/use-toast';

export function useDataMigration() {
  const { user } = useAuthContext();
  const { prompts, clearHistory: clearPrompts } = usePromptStore();
  const { history, clearHistory: clearGenerations } = useGeneratorStore();
  const { savePrompt, refreshPrompts, prompts: cloudPrompts } = useSupabasePrompts();
  const { saveGeneration } = useSupabaseGenerations();
  const [migrationInProgress, setMigrationInProgress] = useState(false);
  const [hasRunMigration, setHasRunMigration] = useState(false);

  useEffect(() => {
    if (user && !migrationInProgress && !hasRunMigration) {
      handleAutoDataSync();
    }
  }, [user, hasRunMigration]);

  const createContentHash = (content: string, title: string) => {
    // Simple hash function to identify duplicate content
    return btoa(content + title).replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
  };

  const handleAutoDataSync = async () => {
    setMigrationInProgress(true);
    
    try {
      // First, refresh to get the latest Supabase data
      await refreshPrompts();
      
      // Check if there's local data to sync
      const hasLocalPrompts = prompts.length > 0;
      const hasLocalHistory = history.length > 0;
      
      if (!hasLocalPrompts && !hasLocalHistory) {
        setHasRunMigration(true);
        setMigrationInProgress(false);
        return;
      }

      console.log('Auto-syncing local data to cloud...');
      
      // Automatically sync all local data to cloud with deduplication
      await migrateLocalData();
      
      setHasRunMigration(true);
    } catch (error) {
      console.error('Error during auto data sync:', error);
    } finally {
      setMigrationInProgress(false);
    }
  };

  const migrateLocalData = async () => {
    let migratedPrompts = 0;
    let migratedGenerations = 0;
    let skippedDuplicates = 0;

    try {
      // Create a set of existing cloud prompt hashes for deduplication
      const existingHashes = new Set();
      cloudPrompts.forEach(prompt => {
        const hash = createContentHash(prompt.content, prompt.title);
        existingHashes.add(hash);
      });

      // Migrate prompts with deduplication
      for (const prompt of prompts) {
        try {
          const contentHash = createContentHash(prompt.content, prompt.title);
          
          // Skip if we already have this content in the cloud
          if (existingHashes.has(contentHash)) {
            skippedDuplicates++;
            console.log(`Skipping duplicate prompt: ${prompt.title}`);
            continue;
          }

          // Also check if exact title and content already exists
          const exactDuplicate = cloudPrompts.some(cloudPrompt => 
            cloudPrompt.title === prompt.title && 
            cloudPrompt.content === prompt.content
          );

          if (exactDuplicate) {
            skippedDuplicates++;
            console.log(`Skipping exact duplicate: ${prompt.title}`);
            continue;
          }

          await savePrompt({
            title: prompt.title,
            description: prompt.description,
            content: prompt.content,
            category: prompt.category,
            persona: prompt.persona,
            tags: prompt.tags,
            heuristics: prompt.heuristics || [],
            variables: prompt.variables || [],
            difficulty: prompt.difficulty || 'intermediate',
            estimatedTime: prompt.estimatedTime || '15 minutes',
            parent_id: prompt.parent_id
          });
          
          existingHashes.add(contentHash);
          migratedPrompts++;
        } catch (error) {
          console.error('Error migrating prompt:', error);
        }
      }

      // Migrate generation history
      for (const generation of history) {
        try {
          await saveGeneration(generation, 'Auto-synced from local storage');
          migratedGenerations++;
        } catch (error) {
          console.error('Error migrating generation:', error);
        }
      }

      // Clear local data after successful migration
      if (migratedPrompts > 0 || migratedGenerations > 0) {
        clearPrompts();
        clearGenerations();
        
        console.log(`Migration complete: ${migratedPrompts} prompts, ${migratedGenerations} generations synced. ${skippedDuplicates} duplicates skipped.`);
        
        // Show a success notification
        const items = [];
        if (migratedPrompts > 0) items.push(`${migratedPrompts} prompts`);
        if (migratedGenerations > 0) items.push(`${migratedGenerations} generations`);
        
        toast({
          title: 'Data synced',
          description: `Your ${items.join(' and ')} are now available across all devices.${skippedDuplicates > 0 ? ` (${skippedDuplicates} duplicates skipped)` : ''}`
        });
      } else if (skippedDuplicates > 0) {
        console.log(`No new data to sync. ${skippedDuplicates} duplicates were skipped.`);
        clearPrompts();
        clearGenerations();
      }
    } catch (error) {
      console.error('Error during auto data migration:', error);
    }
  };

  return { migrationInProgress };
}
