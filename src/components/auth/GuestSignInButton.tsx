
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export function GuestSignInButton() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGuestSignIn = async () => {
    setLoading(true);
    try {
      // Create a temporary guest session in localStorage
      const guestUser = {
        id: 'guest-' + Date.now(),
        email: 'guest@promptduck.dev',
        user_metadata: {
          full_name: 'Guest User',
          avatar_url: null
        },
        created_at: new Date().toISOString(),
        isGuest: true,
        isActive: true, // Mark as explicitly active
        isPersistent: false // Mark as non-persistent (will be cleared on page unload)
      };

      console.log('Creating guest session:', guestUser);
      localStorage.setItem('promptduck_guest_session', JSON.stringify(guestUser));
      
      // Trigger storage event to update AuthProvider
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'promptduck_guest_session',
        newValue: JSON.stringify(guestUser)
      }));
      
      // Force a small delay to ensure localStorage is set and context updates
      await new Promise(resolve => setTimeout(resolve, 200));
      
      console.log('Guest session created, navigating to app...');
      
      toast({
        title: "Welcome!",
        description: "You're now signed in as a guest. Enjoy exploring PromptDuck!",
      });

      // Navigate to app
      navigate('/app/library');
    } catch (error) {
      console.error('Guest sign-in error:', error);
      toast({
        title: "Error",
        description: "Failed to sign in as guest. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleGuestSignIn}
      disabled={loading}
      className="w-full h-11 bg-surface hover:bg-input transition-colors text-primaryText"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <User className="w-4 h-4 mr-2" />
      )}
      Continue as Guest
    </Button>
  );
}
