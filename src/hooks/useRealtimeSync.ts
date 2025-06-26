
import { useEffect } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useSupabasePrompts } from './useSupabasePrompts';
import { useSupabaseGenerations } from './useSupabaseGenerations';
import { supabase } from '@/integrations/supabase/client';

export function useRealtimeSync() {
  const { user } = useAuthContext();
  const { refreshPrompts } = useSupabasePrompts();
  const { refreshGenerations } = useSupabaseGenerations();

  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time sync for user:', user.id);

    // Listen for changes to user's prompts
    const promptsChannel = supabase
      .channel('user-prompts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_prompts',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Prompts changed:', payload);
          refreshPrompts();
        }
      )
      .subscribe();

    // Listen for changes to user's generations
    const generationsChannel = supabase
      .channel('user-generations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_generations',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Generations changed:', payload);
          refreshGenerations();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time sync channels');
      supabase.removeChannel(promptsChannel);
      supabase.removeChannel(generationsChannel);
    };
  }, [user, refreshPrompts, refreshGenerations]);

  return null;
}
