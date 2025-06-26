
import { useEffect } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useSupabasePrompts } from './useSupabasePrompts';
import { useSupabaseGenerations } from './useSupabaseGenerations';

export function useBackgroundPreloader() {
  const { user, isLoaded } = useAuthContext();
  const { initializePrompts } = useSupabasePrompts();
  const { initializeGenerations } = useSupabaseGenerations();

  useEffect(() => {
    // Only start preloading when auth is fully loaded
    if (!isLoaded) return;

    // For authenticated users, start background loading immediately
    if (user) {
      console.log('Starting background preload for authenticated user');
      initializePrompts();
      initializeGenerations();
    }
  }, [user, isLoaded, initializePrompts, initializeGenerations]);

  return null;
}
