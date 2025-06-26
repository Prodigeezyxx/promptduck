
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
  const { savePrompt, refreshPrompts } = useSupabasePrompts();
  const { saveGeneration } = useSupabaseGenerations();
  const [migrationInProgress, setMigrationInProgress] = useState(false);

  useEffect(() => {
    if (user && !migrationInProgress) {
      handleAutoDataSync();
    }
  }, [user]);

  const handleAutoDataSync = async () => {
    setMigrationInProgress(true);
    
    try {
      // First, refresh to get the latest Supabase data
      await refreshPrompts();
      
      // Check if there's local data to sync
      const hasLocalPrompts = prompts.length > 0;
      const hasLocalHistory = history.length > 0;
      
      if (!hasLocalPrompts && !hasLocalHistory) {
        setMigrationInProgress(false);
        return;
      }

      console.log('Auto-syncing local data to cloud...');
      
      // Automatically sync all local data to cloud
      await migrateLocalData();
      
    } catch (error) {
      console.error('Error during auto data sync:', error);
      // Don't show error toast - sync should be invisible to user
    } finally {
      setMigrationInProgress(false);
    }
  };

  const migrateLocalData = async () => {
    let migratedPrompts = 0;
    let migratedGenerations = 0;

    try {
      // Migrate prompts silently
      for (const prompt of prompts) {
        try {
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
          migratedPrompts++;
        } catch (error) {
          console.error('Error migrating prompt:', error);
        }
      }

      // Migrate generation history silently
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
        
        console.log(`Auto-synced ${migratedPrompts} prompts and ${migratedGenerations} generations to cloud`);
        
        // Show a subtle success notification
        const items = [];
        if (migratedPrompts > 0) items.push(`${migratedPrompts} prompts`);
        if (migratedGenerations > 0) items.push(`${migratedGenerations} generations`);
        
        toast({
          title: 'Data synced',
          description: `Your ${items.join(' and ')} are now available across all devices.`
        });
      }
    } catch (error) {
      console.error('Error during auto data migration:', error);
      // Don't clear local data if sync failed
    }
  };

  return { migrationInProgress };
}
