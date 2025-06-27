
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
    <header className="lg:hidden bg-surface border-b border-[rgba(255,255,255,0.05)] mobile-safe-top">
      <div className="flex items-center justify-between p-fluid-md">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="touch-target-large flex-shrink-0 hover:bg-surface text-secondaryText hover:text-primaryText"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link to="/" className="flex items-center space-x-2 touch-manipulation min-w-0">
            <DuckIcon size={24} className="flex-shrink-0" />
            <h1 className="text-fluid-lg font-bold gradient-text truncate">PromptDuck</h1>
          </Link>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <OptimizedThemeToggle />
          <div className="scale-90 origin-right">
            <OptimizedCreditDisplay />
          </div>
        </div>
      </div>
    </header>
  );
}
