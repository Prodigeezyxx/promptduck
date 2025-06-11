
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
    <header className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-border">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="w-11 h-11 px-0 min-h-[44px]"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <Link to="/" className="flex items-center space-x-2 touch-manipulation">
          <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center">
            <DuckIcon size={16} className="text-white" />
          </div>
          {/* Hide text on extra small screens, show on small and up */}
          <h1 className="hidden xs:hidden sm:block text-lg font-bold gradient-text">PromptDuck</h1>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <OptimizedCreditDisplay />
        <OptimizedThemeToggle />
      </div>
    </header>
  );
}
