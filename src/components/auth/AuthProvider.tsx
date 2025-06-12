
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
      if (guestSession) {
        try {
          const guest = JSON.parse(guestSession);
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

  // Override auth state if guest user exists
  const contextValue = {
    ...auth,
    user: guestUser || auth.user,
    isSignedIn: !!guestUser || auth.isSignedIn,
    signOut: async () => {
      if (guestUser) {
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
