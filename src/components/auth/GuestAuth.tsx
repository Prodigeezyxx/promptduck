
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';
import { useAuthContext } from '@/components/auth/AuthProvider';

export function GuestAuth() {
  const { signInAsGuest } = useAuthContext();

  return (
    <Button 
      onClick={signInAsGuest}
      variant="outline"
      className="w-full"
    >
      <UserCircle className="w-4 h-4 mr-2" />
      Continue as Guest
    </Button>
  );
}
