
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { usePromptStore } from '@/store/promptStore';
import { useGeneratorStore } from '@/store/generatorStore';
import { useSupabasePrompts } from './useSupabasePrompts';
import { useSupabaseGenerations } from './useSupabaseGenerations';
import { toast } from '@/hooks/use-toast';

const MIGRATION_KEY = 'promptduck-migration-completed';
const MIGRATION_VERSION = '2.0'; // Increment this to force re-migration if needed

export function useDataMigration() {
  const { user } = useAuthContext();
  const { prompts, clearHistory: clearPrompts } = usePromptStore();
  const { history, clearHistory: clearGenerations } = useGeneratorStore();
  const { savePrompt, refreshPrompts, prompts: cloudPrompts, loading: cloudLoading } = useSupabasePrompts();
  const { saveGeneration } = useSupabaseGenerations();
  const [migrationInProgress, setMigrationInProgress] = useState(false);

  // Check if migration has been completed for this user
  const getMigrationKey = (userId: string) => `${MIGRATION_KEY}-${userId}-${MIGRATION_VERSION}`;
  
  const hasCompletedMigration = (userId: string) => {
    return localStorage.getItem(getMigrationKey(userId)) === 'true';
  };

  const markMigrationComplete = (userId: string) => {
    localStorage.setItem(getMigrationKey(userId), 'true');
  };

  useEffect(() => {
    if (user && !migrationInProgress && !cloudLoading && !hasCompletedMigration(user.id)) {
      handleDataMigration();
    }
  }, [user, cloudLoading]);

  const createContentHash = (content: string, title: string) => {
    // More robust hash function
    const combined = `${title.toLowerCase().trim()}|||${content.toLowerCase().trim()}`;
    return btoa(combined).replace(/[^a-zA-Z0-9]/g, '').slice(0, 32);
  };

  const handleDataMigration = async () => {
    if (!user || migrationInProgress || hasCompletedMigration(user.id)) return;
    
    setMigrationInProgress(true);
    
    try {
      console.log('Starting data migration for user:', user.id);
      
      // First, refresh to get the latest cloud data
      await refreshPrompts();
      
      // Check if there's local data to migrate
      const hasLocalPrompts = prompts.length > 0;
      const hasLocalHistory = history.length > 0;
      
      if (!hasLocalPrompts && !hasLocalHistory) {
        console.log('No local data to migrate');
        markMigrationComplete(user.id);
        setMigrationInProgress(false);
        return;
      }

      console.log(`Migrating ${prompts.length} prompts and ${history.length} generations...`);
      
      await migrateLocalData();
      
      // Mark migration as complete for this user
      markMigrationComplete(user.id);
      
    } catch (error) {
      console.error('Error during data migration:', error);
      toast({
        title: 'Migration Warning',
        description: 'Some local data may not have synced properly. Your data is safe locally.',
        variant: 'destructive'
      });
    } finally {
      setMigrationInProgress(false);
    }
  };

  const migrateLocalData = async () => {
    let migratedPrompts = 0;
    let migratedGenerations = 0;
    let skippedDuplicates = 0;

    try {
      // Create a map of existing cloud prompt hashes for efficient deduplication
      const existingHashes = new Map();
      cloudPrompts.forEach(prompt => {
        const hash = createContentHash(prompt.content, prompt.title);
        existingHashes.set(hash, prompt.id);
      });

      // Migrate prompts with improved deduplication
      for (const prompt of prompts) {
        try {
          const contentHash = createContentHash(prompt.content, prompt.title);
          
          // Skip if we already have this content hash
          if (existingHashes.has(contentHash)) {
            skippedDuplicates++;
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
          
          // Add to our tracking map to prevent duplicates within this migration
          existingHashes.set(contentHash, 'migrating');
          migratedPrompts++;
          
        } catch (error) {
          console.error('Error migrating prompt:', error);
          // Continue with other prompts even if one fails
        }
      }

      // Migrate generation history
      for (const generation of history) {
        try {
          await saveGeneration(generation, 'Migrated from local storage');
          migratedGenerations++;
        } catch (error) {
          console.error('Error migrating generation:', error);
          // Continue with other generations even if one fails
        }
      }

      // Clear local data after successful migration
      if (migratedPrompts > 0 || migratedGenerations > 0 || skippedDuplicates > 0) {
        clearPrompts();
        clearGenerations();
        
        console.log(`Migration complete: ${migratedPrompts} prompts, ${migratedGenerations} generations synced. ${skippedDuplicates} duplicates skipped.`);
        
        if (migratedPrompts > 0 || migratedGenerations > 0) {
          const items = [];
          if (migratedPrompts > 0) items.push(`${migratedPrompts} prompts`);
          if (migratedGenerations > 0) items.push(`${migratedGenerations} generations`);
          
          toast({
            title: 'Data synced successfully',
            description: `Your ${items.join(' and ')} are now available across all devices.`
          });
        }
      }
    } catch (error) {
      console.error('Error during migration:', error);
      throw error;
    }
  };

  return { migrationInProgress };
}
