
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Loader2, LogOut, User, UserCircle } from 'lucide-react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { SignInDialog } from '@/components/auth/SignInDialog';
import { GuestAuth } from '@/components/auth/GuestAuth';

export function AuthButtons() {
  const { user, loading, signOut, isSignedIn, isLoaded, isGuest } = useAuthContext();
  const [showSignInDialog, setShowSignInDialog] = useState(false);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center space-x-3">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isSignedIn && (user || isGuest)) {
    return (
      <div className="flex items-center space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                {isGuest ? (
                  <AvatarFallback>
                    <UserCircle className="h-4 w-4" />
                  </AvatarFallback>
                ) : (
                  <>
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name || user?.email} />
                    <AvatarFallback>
                      {user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U'}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuItem className="flex-col items-start">
              <div className="font-medium">
                {isGuest ? 'Guest User' : (user?.user_metadata?.full_name || 'User')}
              </div>
              <div className="text-sm text-muted-foreground">
                {isGuest ? 'Limited access mode' : user?.email}
              </div>
            </DropdownMenuItem>
            {isGuest && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowSignInDialog(true)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Create Account</span>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <SignInDialog open={showSignInDialog} onOpenChange={setShowSignInDialog} />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button 
        onClick={() => setShowSignInDialog(true)}
        className="bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white border-0 shadow-lg text-sm px-4 py-2"
      >
        Sign In
      </Button>
      <GuestAuth />
      <SignInDialog open={showSignInDialog} onOpenChange={setShowSignInDialog} />
    </div>
  );
}
