
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { promptPersistence } from '@/utils/promptPersistence';

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
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        console.log('Full auth event details:', { 
          event, 
          session: session ? {
            access_token: session.access_token ? 'present' : 'missing',
            refresh_token: session.refresh_token ? 'present' : 'missing',
            expires_at: session.expires_at,
            user: session.user ? {
              id: session.user.id,
              email: session.user.email,
              provider: session.user.app_metadata?.provider
            } : null
          } : null
        });
        
        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false,
        });

        // Handle OAuth callback success
        if (event === 'SIGNED_IN' && session) {
          console.log('OAuth sign-in successful for:', session.user.email);
          
          // Check for post-auth redirect
          const redirectInfo = promptPersistence.getAndClearRedirectInfo();
          if (redirectInfo) {
            console.log('Found redirect info after auth:', redirectInfo);
            
            // If there's a prompt, store it for the generator
            if (redirectInfo.prompt) {
              promptPersistence.storePrompt(redirectInfo.prompt, false);
            }
            
            // Navigate to the generator page instead of the original path
            setTimeout(() => {
              window.location.href = '/app/generator';
            }, 100);
          }
        }
        
        // Handle OAuth errors
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
    );

    // THEN check for existing session
    const getInitialSession = async () => {
      try {
        console.log('Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', {
            message: error.message,
            status: error.status,
            details: error
          });
        } else {
          console.log('Initial session check:', session ? {
            user_email: session.user?.email,
            expires_at: session.expires_at,
            provider: session.user?.app_metadata?.provider
          } : 'No session');
        }
        
        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false,
        });
      } catch (error) {
        console.error('Unexpected error getting session:', error);
        setAuthState({
          user: null,
          session: null,
          loading: false,
        });
      }
    };

    getInitialSession();

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log('=== Initiating Google OAuth ===');
      console.log('Current environment details:', {
        href: window.location.href,
        origin: window.location.origin,
        host: window.location.host,
        protocol: window.location.protocol,
        pathname: window.location.pathname
      });
      
      // Use the current origin for redirect
      const redirectUrl = `${window.location.origin}/`;
      console.log('OAuth redirect URL:', redirectUrl);
      
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
        console.error('Supabase OAuth error details:', {
          message: error.message,
          status: error.status,
          code: error.code,
          name: error.name,
          details: error
        });
        return { error };
      } else {
        console.log('OAuth request initiated successfully:', {
          url: data.url,
          provider: data.provider
        });
        return { error: null };
      }
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
    console.log('Signing out...');
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setAuthState({
        user: null,
        session: null,
        loading: false,
      });
    }
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
