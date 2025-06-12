
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  isSignedIn: boolean;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const [guestUser, setGuestUser] = useState<any>(null);

  // Check for guest session on mount and when auth state changes
  useEffect(() => {
    const checkGuestSession = () => {
      const guestSession = localStorage.getItem('promptduck_guest_session');
      console.log('Checking guest session:', guestSession ? 'found' : 'not found');
      if (guestSession) {
        try {
          const guest = JSON.parse(guestSession);
          console.log('Setting guest user:', guest);
          setGuestUser(guest);
        } catch (error) {
          console.error('Failed to parse guest session:', error);
          localStorage.removeItem('promptduck_guest_session');
          setGuestUser(null);
        }
      } else {
        setGuestUser(null);
      }
    };

    checkGuestSession();
    
    // Listen for storage changes to sync across tabs
    window.addEventListener('storage', checkGuestSession);
    
    return () => {
      window.removeEventListener('storage', checkGuestSession);
    };
  }, []);

  // Log current state for debugging
  useEffect(() => {
    console.log('Auth Provider State:', {
      guestUser: !!guestUser,
      authUser: !!auth.user,
      authLoading: auth.loading,
      isSignedIn: !!guestUser || auth.isSignedIn
    });
  }, [guestUser, auth.user, auth.loading, auth.isSignedIn]);

  // Override auth state if guest user exists
  const contextValue = {
    ...auth,
    user: guestUser || auth.user,
    isSignedIn: !!guestUser || auth.isSignedIn,
    signOut: async () => {
      if (guestUser) {
        console.log('Signing out guest user');
        localStorage.removeItem('promptduck_guest_session');
        setGuestUser(null);
        return { error: null };
      }
      return auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
