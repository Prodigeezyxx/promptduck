
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
        isGuest: true
      };

      localStorage.setItem('promptduck_guest_session', JSON.stringify(guestUser));
      
      toast({
        title: "Welcome!",
        description: "You're now signed in as a guest. Some features may be limited.",
      });

      // Navigate to the app
      navigate('/app/library');
    } catch (error) {
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
      className="w-full h-11 bg-muted hover:bg-muted/80 transition-colors"
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
