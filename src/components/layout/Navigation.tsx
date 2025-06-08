
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { CreditDisplay } from '@/components/CreditDisplay';
import { 
  BookOpen, 
  Wand2, 
  PlayCircle, 
  Settings as SettingsIcon, 
  Code
} from 'lucide-react';

const navigation = [
  { name: 'Library', href: '/library', icon: BookOpen },
  { name: 'Generator', href: '/generator', icon: Wand2 },
  { name: 'Playground', href: '/playground', icon: PlayCircle },
  { name: 'System Editor', href: '/system-editor', icon: Code },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🦆</span>
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">PromptDuck</h1>
            <p className="text-xs text-muted-foreground">prompt like a PRO</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-4">
        <CreditDisplay />
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <Link to="/">
            <Button variant="ghost" size="sm">
              Landing
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
