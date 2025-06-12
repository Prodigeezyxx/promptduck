
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';
import { useAuthContext } from '@/components/auth/AuthProvider';

export function GuestAuth() {
  const { signInAsGuest } = useAuthContext();

  return (
    <Button 
      onClick={signInAsGuest}
      variant="outline"
      className="h-10 px-4 border-2 hover:bg-accent/50"
    >
      <UserCircle className="w-4 h-4 mr-2" />
      Continue as Guest
    </Button>
  );
}
