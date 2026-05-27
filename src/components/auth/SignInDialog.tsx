
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, ChevronDown } from 'lucide-react';
import { GoogleAuthButton } from './GoogleAuthButton';
import { GuestSignInButton } from './GuestSignInButton';
import { useAuthContext } from './AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectAfterAuth?: string;
}

export function SignInDialog({ open, onOpenChange, redirectAfterAuth }: SignInDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showEmailAuth, setShowEmailAuth] = useState(false);
  const { signInWithEmail, signUpWithEmail, isSignedIn } = useAuthContext();
  const { toast } = useToast();

  // Close dialog when user successfully signs in and handle redirect
  useEffect(() => {
    if (isSignedIn && open) {
      console.log('User signed in, closing dialog');
      onOpenChange(false);
      
      // Handle post-auth redirect
      if (redirectAfterAuth) {
        const navigate = () => {
          window.location.href = redirectAfterAuth;
        };
        // Small delay to ensure dialog closes smoothly
        setTimeout(navigate, 100);
      }
    }
  }, [isSignedIn, open, onOpenChange, redirectAfterAuth]);

  const handleEmailAuth = async (asSignUp?: boolean) => {
    if (!email || !password) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Invalid Password',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const willSignUp = asSignUp ?? isSignUp;
    try {
      const { error } = willSignUp 
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password);

      if (error) {
        console.error('Auth error:', error);
        
        let errorMessage = error.message;
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message.includes('User already registered')) {
          errorMessage = 'An account with this email already exists. Please sign in instead.';
        }
        
        toast({
          title: willSignUp ? 'Sign Up Failed' : 'Sign In Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      } else {
        if (willSignUp) {
          toast({
            title: 'Account Created',
            description: 'Please check your email to confirm your account before signing in.',
          });
          setEmail('');
          setPassword('');
        } else {
          toast({
            title: 'Welcome Back',
            description: 'You have been signed in successfully.',
          });
        }
      }
    } catch (error) {
      console.error('Unexpected auth error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Welcome to PromptDuck
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Guest Access - No account needed */}
          <div className="space-y-3">
            <GuestSignInButton redirectTo={redirectAfterAuth} />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Primary Google Auth */}
          <div className="space-y-3">
            <GoogleAuthButton />
          </div>

          {/* Secondary Email Auth - Collapsible */}
          <Collapsible open={showEmailAuth} onOpenChange={setShowEmailAuth}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full text-sm text-muted-foreground hover:text-foreground"
              >
                <span>Other sign-in options</span>
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showEmailAuth ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-4 pt-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Email</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={isSignUp ? "Create a password (min. 6 characters)" : "Enter your password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEmailAuth(false)}
                    disabled={loading}
                    className="flex-1"
                    variant="default"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => handleEmailAuth(true)}
                    disabled={loading}
                    variant="outline"
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Sign Up'
                    )}
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </DialogContent>
    </Dialog>
  );
}
