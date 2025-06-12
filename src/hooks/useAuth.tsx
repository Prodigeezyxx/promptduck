
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isGuest: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isGuest: false,
  });

  useEffect(() => {
    // Check for guest mode
    const guestMode = localStorage.getItem('promptduck-guest-mode');
    if (guestMode === 'true') {
      setAuthState({
        user: null,
        session: null,
        loading: false,
        isGuest: true,
      });
      return;
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false,
          isGuest: false,
        });
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        session: session,
        loading: false,
        isGuest: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });
    return { error };
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { error };
  };

  const signInAsGuest = () => {
    localStorage.setItem('promptduck-guest-mode', 'true');
    setAuthState({
      user: null,
      session: null,
      loading: false,
      isGuest: true,
    });
  };

  const signOut = async () => {
    localStorage.removeItem('promptduck-guest-mode');
    const { error } = await supabase.auth.signOut();
    setAuthState({
      user: null,
      session: null,
      loading: false,
      isGuest: false,
    });
    return { error };
  };

  return {
    ...authState,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInAsGuest,
    signOut,
    isSignedIn: !!authState.user || authState.isGuest,
    isLoaded: !authState.loading,
  };
}
