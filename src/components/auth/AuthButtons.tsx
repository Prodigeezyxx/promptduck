
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function AuthButtons() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center space-x-3">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center space-x-3">
        <UserButton 
          afterSignOutUrl="/" 
          appearance={{
            elements: {
              avatarBox: "w-8 h-8"
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <SignInButton mode="modal">
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
          Sign In
        </Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button className="bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white border-0 shadow-lg">
          Sign Up
        </Button>
      </SignUpButton>
    </div>
  );
}
