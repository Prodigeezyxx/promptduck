
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export function LandingHeader() {
  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-gray-900/80 dark:bg-black/80 border-b border-gray-700/50 dark:border-gray-800/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🦆</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">PromptDuck</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link to="/app">
            <Button className="bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white border-0 shadow-lg">
              Launch App
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
