
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { CreditDisplay } from '@/components/CreditDisplay';
import { DuckIcon } from '@/components/icons/DuckIcon';
import { Link } from 'react-router-dom';
import { memo } from 'react';

const OptimizedCreditDisplay = memo(CreditDisplay);
const OptimizedThemeToggle = memo(ThemeToggle);

interface MobileHeaderProps {
  onMenuToggle: () => void;
}

export function MobileHeader({ onMenuToggle }: MobileHeaderProps) {
  return (
    <header className="lg:hidden flex items-center justify-between p-3 sm:p-4 bg-card border-b border-border">
      <div className="flex items-center space-x-2 min-w-0 flex-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="w-10 h-10 px-0 min-h-[40px] flex-shrink-0"
          aria-label="Toggle menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        <Link to="/" className="flex items-center space-x-2 touch-manipulation min-w-0">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <DuckIcon size={14} className="text-white sm:w-4 sm:h-4" />
          </div>
          {/* Responsive text sizing with proper truncation */}
          <h1 className="text-sm sm:text-lg font-bold gradient-text truncate">PromptDuck</h1>
        </Link>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
        <OptimizedCreditDisplay />
        <OptimizedThemeToggle />
      </div>
    </header>
  );
}
