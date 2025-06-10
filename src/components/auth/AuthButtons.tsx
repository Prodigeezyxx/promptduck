
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

export function AuthButtons() {
  // Check if Clerk is available
  const hasClerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!hasClerkKey) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="gap-2" disabled>
          <LogIn className="w-4 h-4" />
          Sign In
        </Button>
        <Button size="sm" className="gap-2 bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white border-0" disabled>
          <UserPlus className="w-4 h-4" />
          Sign Up
        </Button>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <div className="flex items-center gap-2">
          <SignInButton mode="modal" fallbackRedirectUrl="/app/library">
            <Button variant="ghost" size="sm" className="gap-2">
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal" fallbackRedirectUrl="/app/library">
            <Button size="sm" className="gap-2 bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white border-0">
              <UserPlus className="w-4 h-4" />
              Sign Up
            </Button>
          </SignUpButton>
        </div>
      </SignedOut>
      
      <SignedIn>
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-8 h-8"
            }
          }}
          afterSignOutUrl="/"
        />
      </SignedIn>
    </>
  );
}
