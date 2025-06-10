
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { AuthButtons } from '@/components/auth/AuthButtons';
import { CreditDisplay } from '@/components/CreditDisplay';
import { 
  BookOpen, 
  Wand2, 
  PlayCircle, 
  Settings as SettingsIcon,
  Home
} from 'lucide-react';

const navigation = [
  { name: 'Library', href: '/app/library', icon: BookOpen },
  { name: 'Generator', href: '/app/generator', icon: Wand2 },
  { name: 'Playground', href: '/app/playground', icon: PlayCircle },
  { name: 'Settings', href: '/app/settings', icon: SettingsIcon },
];

export function Navigation() {
  const location = useLocation();

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-background border-r">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-6 py-4 border-b">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🦆</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">PromptDuck</h1>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t space-y-4">
          {/* Credit Display */}
          <CreditDisplay />
          
          <div className="flex items-center justify-between">
            <ThemeToggle />
          </div>
          
          <AuthButtons />
          
          <Link to="/">
            <Button variant="outline" size="sm" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
