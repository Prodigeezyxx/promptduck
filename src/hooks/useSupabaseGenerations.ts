
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { GenerationResult } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useSupabaseGenerations() {
  const { user } = useAuthContext();
  const [generations, setGenerations] = useState<GenerationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastLoadTime, setLastLoadTime] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load generations from Supabase
  const loadGenerations = useCallback(async (force = false) => {
    if (!user) return;
    
    // Skip if recently loaded and not forced
    const now = Date.now();
    if (!force && lastLoadTime && (now - lastLoadTime) < 30000) { // 30 seconds cache
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const mappedGenerations: GenerationResult[] = data.map(item => ({
        id: item.id,
        result: item.result,
        metadata: {
          intent: item.intent || '',
          context: item.context || '',
          complexity: item.complexity || 'intermediate',
          heuristics: item.heuristics || [],
          ...(item.metadata && typeof item.metadata === 'object' ? item.metadata : {})
        },
        created_at: item.created_at,
        version: 1
      }));

      setGenerations(mappedGenerations);
      setLastLoadTime(now);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading generations:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to load generation history',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [user, lastLoadTime]);

  // Initialize generations when user is authenticated
  useEffect(() => {
    if (user && !isInitialized) {
      loadGenerations();
    } else if (!user) {
      // Clear generations when user signs out
      setGenerations([]);
      setIsInitialized(false);
      setLastLoadTime(null);
    }
  }, [user, isInitialized, loadGenerations]);

  const saveGeneration = async (result: GenerationResult, intent: string, context?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_generations')
        .insert({
          user_id: user.id,
          result: result.result,
          intent: intent,
          context: context,
          complexity: result.metadata?.complexity || 'intermediate',
          heuristics: result.metadata?.heuristics || [],
          metadata: result.metadata || {}
        })
        .select()
        .single();

      if (error) throw error;

      const newGeneration: GenerationResult = {
        id: data.id,
        result: data.result,
        metadata: {
          intent: data.intent || '',
          context: data.context || '',
          complexity: data.complexity || 'intermediate',
          heuristics: data.heuristics || [],
          ...(data.metadata && typeof data.metadata === 'object' ? data.metadata : {})
        },
        created_at: data.created_at,
        version: 1
      };

      setGenerations(prev => [newGeneration, ...prev]);
    } catch (error) {
      console.error('Error saving generation:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to save generation to cloud',
        variant: 'destructive'
      });
    }
  };

  const refreshGenerations = async () => {
    await loadGenerations(true);
  };

  const setHistory = (history: GenerationResult[]) => {
    setGenerations(history);
  };

  // External initialization function for preloading
  const initializeGenerations = useCallback(() => {
    if (user && !isInitialized && !loading) {
      loadGenerations();
    }
  }, [user, isInitialized, loading, loadGenerations]);

  return {
    generations,
    loading,
    isInitialized,
    saveGeneration,
    refreshGenerations,
    setHistory,
    initializeGenerations
  };
}
