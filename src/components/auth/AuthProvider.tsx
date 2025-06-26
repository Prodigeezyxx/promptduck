
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDataMigration } from '@/hooks/useDataMigration';
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
  
  // Initialize data migration hook
  useDataMigration();

  // Check for guest session only if explicitly created
  useEffect(() => {
    const checkGuestSession = () => {
      try {
        const guestSession = localStorage.getItem('promptduck_guest_session');
        console.log('AuthProvider: Checking guest session:', guestSession ? 'found' : 'not found');
        
        if (guestSession) {
          const guest = JSON.parse(guestSession);
          // Only use guest session if it was created in the last 24 hours and is explicitly marked as active
          const sessionAge = Date.now() - new Date(guest.created_at).getTime();
          const twentyFourHours = 24 * 60 * 60 * 1000;
          
          if (sessionAge < twentyFourHours && guest.isActive) {
            console.log('AuthProvider: Setting active guest user:', guest);
            setGuestUser(guest);
          } else {
            console.log('AuthProvider: Removing expired or inactive guest session');
            localStorage.removeItem('promptduck_guest_session');
            setGuestUser(null);
          }
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
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'promptduck_guest_session') {
        checkGuestSession();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up guest sessions when the page is unloaded (user navigates away or closes browser)
    const handleBeforeUnload = () => {
      const guestSession = localStorage.getItem('promptduck_guest_session');
      if (guestSession) {
        try {
          const guest = JSON.parse(guestSession);
          if (guest.isGuest && !guest.isPersistent) {
            localStorage.removeItem('promptduck_guest_session');
          }
        } catch (error) {
          localStorage.removeItem('promptduck_guest_session');
        }
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
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
