
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false,
        });
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        session: session,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log('Initiating Google OAuth with Supabase...');
      console.log('Current URL:', window.location.href);
      
      const redirectUrl = `${window.location.origin}/`;
      console.log('Redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        console.error('Supabase OAuth error:', {
          message: error.message,
          status: error.status,
          code: error.code,
          details: error
        });
      } else {
        console.log('OAuth request initiated:', data);
      }
      
      return { error };
    } catch (error) {
      console.error('Unexpected OAuth error:', error);
      return { error };
    }
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

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setAuthState({
      user: null,
      session: null,
      loading: false,
    });
    return { error };
  };

  return {
    ...authState,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    isSignedIn: !!authState.user,
    isLoaded: !authState.loading,
  };
}
