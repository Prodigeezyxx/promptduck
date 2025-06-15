
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { GenerationResult } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useSupabaseGenerations() {
  const { user } = useAuthContext();
  const [generations, setGenerations] = useState<GenerationResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadGenerations();
    }
  }, [user]);

  const loadGenerations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const mappedGenerations: GenerationResult[] = data.map(item => {
        try {
          const result = JSON.parse(item.result);
          return {
            ...result,
            id: item.id,
            created_at: item.created_at
          };
        } catch (e) {
          console.error('Error parsing generation result:', e);
          return null;
        }
      }).filter(Boolean);

      setGenerations(mappedGenerations);
    } catch (error) {
      console.error('Error loading generations:', error);
      toast({ title: 'Error', description: 'Failed to load generation history from cloud' });
    } finally {
      setLoading(false);
    }
  };

  const saveGeneration = async (result: GenerationResult, intent: string, context?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_generations')
        .insert({
          user_id: user.id,
          intent,
          context,
          complexity: 'intermediate',
          heuristics: result.heuristics || [],
          result: JSON.stringify(result),
          metadata: {
            tags: result.tags,
            variables: result.variables
          }
        });

      if (error) throw error;

      setGenerations(prev => [result, ...prev].slice(0, 50));
    } catch (error) {
      console.error('Error saving generation:', error);
      toast({ title: 'Error', description: 'Failed to save generation to cloud' });
    }
  };

  const clearGenerations = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_generations')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setGenerations([]);
    } catch (error) {
      console.error('Error clearing generations:', error);
      toast({ title: 'Error', description: 'Failed to clear generation history' });
    }
  };

  return {
    generations,
    loading,
    saveGeneration,
    clearGenerations,
    refreshGenerations: loadGenerations
  };
}
