import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './AuthProvider';

export function GuestSignInButton({ redirectTo }: { redirectTo?: string }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signInAsGuest } = useAuthContext();

  const handleGuestSignIn = async () => {
    setLoading(true);
    try {
      signInAsGuest();

      toast({
        title: "Welcome!",
        description: "You're now signed in as a guest. Enjoy exploring PromptDuck!",
      });

      navigate(redirectTo || '/app/library');
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