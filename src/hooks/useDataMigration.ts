
import { useEffect } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { usePromptStore } from '@/store/promptStore';
import { useGeneratorStore } from '@/store/generatorStore';
import { useSupabasePrompts } from './useSupabasePrompts';
import { useSupabaseGenerations } from './useSupabaseGenerations';
import { toast } from '@/hooks/use-toast';

export function useDataMigration() {
  const { user } = useAuthContext();
  const { prompts } = usePromptStore();
  const { history } = useGeneratorStore();
  const { savePrompt } = useSupabasePrompts();
  const { saveGeneration } = useSupabaseGenerations();

  useEffect(() => {
    if (user && prompts.length > 0) {
      migrateLocalData();
    }
  }, [user]);

  const migrateLocalData = async () => {
    try {
      // Check if this is the first time user is signing in with local data
      const migrationKey = `promptduck-migrated-${user?.id}`;
      const alreadyMigrated = localStorage.getItem(migrationKey);
      
      if (alreadyMigrated) return;

      let migratedCount = 0;

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
            heuristics: prompt.heuristics,
            variables: prompt.variables,
            difficulty: prompt.difficulty,
            estimatedTime: prompt.estimatedTime,
            parent_id: prompt.parent_id
          });
          migratedCount++;
        } catch (error) {
          console.error('Error migrating prompt:', error);
        }
      }

      // Migrate generation history
      for (const generation of history) {
        try {
          await saveGeneration(generation, 'Migrated from local storage');
        } catch (error) {
          console.error('Error migrating generation:', error);
        }
      }

      // Mark as migrated
      localStorage.setItem(migrationKey, 'true');

      if (migratedCount > 0) {
        toast({
          title: 'Data synced!',
          description: `Your ${migratedCount} local prompts have been synced to the cloud.`
        });
      }
    } catch (error) {
      console.error('Error during data migration:', error);
      toast({
        title: 'Sync incomplete',
        description: 'Some data may not have synced properly. Please try again.'
      });
    }
  };
}
