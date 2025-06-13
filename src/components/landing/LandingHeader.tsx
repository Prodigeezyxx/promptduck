
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AuthButtons } from '@/components/auth/AuthButtons';
import { ClearSessionButton } from '@/components/auth/ClearSessionButton';
import { DuckIcon } from '@/components/icons/DuckIcon';
import { useAuthContext } from '@/components/auth/AuthProvider';

export function LandingHeader() {
  const { isSignedIn, user } = useAuthContext();

  // Check if user is a guest by looking for the isGuest property (type assertion needed for custom guest user)
  const isGuest = user && typeof user === 'object' && 'isGuest' in user && (user as any).isGuest;

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-gray-900/80 dark:bg-black/80 border-b border-gray-700/50 dark:border-gray-800/50">
      <div className="container mx-auto px-3 sm:px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
          <DuckIcon size={32} className="sm:w-8 sm:h-8" />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white">PromptDuck</h1>
          </div>
        </Link>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          {isSignedIn ? (
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Link to="/app/library">
                <Button className="bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white border-0 shadow-lg text-xs sm:text-sm px-3 sm:px-4 py-2">
                  Launch App
                </Button>
              </Link>
              {/* Show clear session button for guest users */}
              {isGuest && <ClearSessionButton />}
              <AuthButtons />
            </div>
          ) : (
            <AuthButtons />
          )}
        </div>
      </div>
    </header>
  );
}
