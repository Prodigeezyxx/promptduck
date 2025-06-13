
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Check for guest session immediately and synchronously
  useEffect(() => {
    const checkGuestSession = () => {
      try {
        const guestSession = localStorage.getItem('promptduck_guest_session');
        console.log('AuthProvider: Checking guest session:', guestSession ? 'found' : 'not found');
        
        if (guestSession) {
          const guest = JSON.parse(guestSession);
          console.log('AuthProvider: Setting guest user:', guest);
          setGuestUser(guest);
        } else {
          setGuestUser(null);
        }
      } catch (error) {
        console.error('AuthProvider: Failed to parse guest session:', error);
        localStorage.removeItem('promptduck_guest_session');
        setGuestUser(null);
      }
    };

    // Check immediately
    checkGuestSession();
    setIsInitialized(true);
    
    // Listen for storage changes to sync across tabs
    window.addEventListener('storage', checkGuestSession);
    
    return () => {
      window.removeEventListener('storage', checkGuestSession);
    };
  }, []);

  // Log current state for debugging
  useEffect(() => {
    if (isInitialized) {
      console.log('AuthProvider: State update:', {
        guestUser: !!guestUser,
        authUser: !!auth.user,
        authLoading: auth.loading,
        isSignedIn: !!guestUser || auth.isSignedIn,
        isLoaded: isInitialized && auth.isLoaded
      });
    }
  }, [guestUser, auth.user, auth.loading, auth.isSignedIn, isInitialized]);

  // Override auth state if guest user exists
  const contextValue = {
    ...auth,
    user: guestUser || auth.user,
    isSignedIn: !!guestUser || auth.isSignedIn,
    isLoaded: isInitialized && auth.isLoaded,
    signOut: async () => {
      if (guestUser) {
        console.log('AuthProvider: Signing out guest user');
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
