
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
      handleDataSync();
    }
  }, [user]);

  const handleDataSync = async () => {
    setMigrationInProgress(true);
    
    try {
      // First, refresh to get the latest Supabase data
      await refreshPrompts();
      
      // Check if there's local data to migrate
      const hasLocalPrompts = prompts.length > 0;
      const hasLocalHistory = history.length > 0;
      
      if (!hasLocalPrompts && !hasLocalHistory) {
        setMigrationInProgress(false);
        return;
      }

      // Ask user if they want to sync local data
      const shouldSync = await showSyncDialog(hasLocalPrompts, hasLocalHistory);
      
      if (shouldSync) {
        await migrateLocalData();
      } else {
        // User chose not to sync, clear local data to avoid confusion
        clearPrompts();
        clearGenerations();
      }
    } catch (error) {
      console.error('Error during data sync:', error);
      toast({
        title: 'Sync error',
        description: 'There was an issue syncing your data. Your local data is preserved.',
        variant: 'destructive'
      });
    } finally {
      setMigrationInProgress(false);
    }
  };

  const showSyncDialog = (hasPrompts: boolean, hasHistory: boolean): Promise<boolean> => {
    return new Promise((resolve) => {
      const items = [];
      if (hasPrompts) items.push(`${prompts.length} saved prompts`);
      if (hasHistory) items.push(`${history.length} generation entries`);
      
      const itemText = items.join(' and ');
      
      const shouldSync = window.confirm(
        `You have ${itemText} saved locally. Would you like to sync this data to your cloud account?\n\n` +
        `Choose "OK" to sync and keep this data across all your devices.\n` +
        `Choose "Cancel" to start fresh with your cloud data.`
      );
      
      resolve(shouldSync);
    });
  };

  const migrateLocalData = async () => {
    let migratedPrompts = 0;
    let migratedGenerations = 0;

    try {
      // Migrate prompts
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

      // Migrate generation history
      for (const generation of history) {
        try {
          await saveGeneration(generation, 'Migrated from local storage');
          migratedGenerations++;
        } catch (error) {
          console.error('Error migrating generation:', error);
        }
      }

      // Clear local data after successful migration
      if (migratedPrompts > 0 || migratedGenerations > 0) {
        clearPrompts();
        clearGenerations();
        
        const items = [];
        if (migratedPrompts > 0) items.push(`${migratedPrompts} prompts`);
        if (migratedGenerations > 0) items.push(`${migratedGenerations} generations`);
        
        toast({
          title: 'Data synced successfully!',
          description: `${items.join(' and ')} have been synced to your cloud account.`
        });
      }
    } catch (error) {
      console.error('Error during data migration:', error);
      toast({
        title: 'Sync incomplete',
        description: 'Some data may not have synced properly. Your local data is preserved.',
        variant: 'destructive'
      });
    }
  };

  return { migrationInProgress };
}
