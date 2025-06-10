
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { CreditDisplay } from '@/components/CreditDisplay';
import { DuckIcon } from '@/components/icons/DuckIcon';
import { Link } from 'react-router-dom';

interface MobileHeaderProps {
  onMenuToggle: () => void;
}

export function MobileHeader({ onMenuToggle }: MobileHeaderProps) {
  return (
    <header className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-border">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="w-9 h-9 px-0"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center">
            <DuckIcon size={16} className="text-white" />
          </div>
          {/* Hide text on small screens, show on medium and up */}
          <h1 className="hidden sm:block text-lg font-bold gradient-text">PromptDuck</h1>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <CreditDisplay />
        <ThemeToggle />
      </div>
    </header>
  );
}
