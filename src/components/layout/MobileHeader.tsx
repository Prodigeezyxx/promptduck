
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
    <header className="lg:hidden bg-surface border-b border-[rgba(255,255,255,0.05)]">
      <div className="flex items-center justify-between p-3 sm:p-4">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="w-9 h-9 px-0 flex-shrink-0 hover:bg-surface text-secondaryText hover:text-primaryText"
            aria-label="Toggle menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <Link to="/" className="flex items-center space-x-2 touch-manipulation min-w-0">
            <DuckIcon size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
            <h1 className="text-sm sm:text-lg font-bold gradient-text truncate">PromptDuck</h1>
          </Link>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <OptimizedThemeToggle />
          <div className="scale-75 origin-right">
            <OptimizedCreditDisplay />
          </div>
        </div>
      </div>
    </header>
  );
}
