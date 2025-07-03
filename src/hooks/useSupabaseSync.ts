import { useEffect } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { usePromptStore } from '@/store/promptStore';
import { useSupabasePrompts } from './useSupabasePrompts';
import { useSupabaseGenerations } from './useSupabaseGenerations';

export function useSupabaseSync() {
  const { user } = useAuthContext();
  const { setPrompts } = usePromptStore();
  
  // Supabase hooks
  const { prompts: supabasePrompts } = useSupabasePrompts();
  const { generations, setHistory: setSupabaseHistory } = useSupabaseGenerations();

  // Sync Supabase data to local stores when user is authenticated
  useEffect(() => {
    if (user && supabasePrompts.length > 0) {
      setPrompts(supabasePrompts);
    }
  }, [user, supabasePrompts, setPrompts]);

  useEffect(() => {
    if (user && generations.length > 0) {
      setSupabaseHistory(generations);
    }
  }, [user, generations, setSupabaseHistory]);

  return { user };
}