
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { SignInButton, UserButton, useAuth } from '@clerk/clerk-react';

export function LandingHeader() {
  const { isSignedIn } = useAuth();

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-gray-900/80 dark:bg-black/80 border-b border-gray-700/50 dark:border-gray-800/50">
      <div className="container mx-auto px-3 sm:px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs sm:text-sm">🦆</span>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white">PromptDuck</h1>
          </div>
        </Link>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="order-1 sm:order-none">
            <ThemeToggle />
          </div>
          
          {isSignedIn ? (
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Link to="/app/library">
                <Button className="bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white border-0 shadow-lg text-xs sm:text-sm px-3 sm:px-4 py-2">
                  Launch App
                </Button>
              </Link>
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    avatarBox: "w-7 h-7 sm:w-8 sm:h-8"
                  }
                }}
              />
            </div>
          ) : (
            <SignInButton mode="modal" fallbackRedirectUrl="/app/library">
              <Button className="bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white border-0 shadow-lg text-xs sm:text-sm px-3 sm:px-4 py-2">
                Launch App
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
