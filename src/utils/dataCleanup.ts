
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const cleanupDuplicatePrompts = async (userId: string) => {
  try {
    // First, get all prompts for the user
    const { data: prompts, error } = await supabase
      .from('user_prompts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (!prompts || prompts.length === 0) {
      toast({ title: 'No prompts found', description: 'No prompts to clean up.' });
      return;
    }

    // Group by title and content to find duplicates
    const seen = new Map();
    const toDelete = [];

    for (const prompt of prompts) {
      const key = `${prompt.title}|||${prompt.content}`;
      if (seen.has(key)) {
        // This is a duplicate, mark for deletion
        toDelete.push(prompt.id);
      } else {
        seen.set(key, prompt.id);
      }
    }

    if (toDelete.length === 0) {
      toast({ title: 'No duplicates found', description: 'Your library is already clean!' });
      return;
    }

    // Delete duplicates
    const { error: deleteError } = await supabase
      .from('user_prompts')
      .delete()
      .in('id', toDelete);

    if (deleteError) throw deleteError;

    toast({
      title: 'Cleanup complete!',
      description: `Removed ${toDelete.length} duplicate prompts from your library.`
    });

    return toDelete.length;
  } catch (error) {
    console.error('Error cleaning up duplicates:', error);
    toast({
      title: 'Cleanup failed',
      description: 'Failed to clean up duplicates. Please try again.',
      variant: 'destructive'
    });
  }
};

export const clearMigrationFlags = () => {
  // Clear all migration flags to prevent auto-migration
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.includes('migration')) {
      localStorage.removeItem(key);
    }
  });
  
  toast({
    title: 'Migration flags cleared',
    description: 'Auto-migration has been disabled.'
  });
};
