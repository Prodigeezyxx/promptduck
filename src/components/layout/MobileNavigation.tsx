
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
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

interface MobileNavigationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNavigation({ open, onOpenChange }: MobileNavigationProps) {
  const location = useLocation();

  const handleLinkClick = () => {
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] bg-surface border-t border-[rgba(255,255,255,0.05)] mobile-safe-bottom">
        <DrawerHeader className="border-b border-[rgba(255,255,255,0.05)] p-fluid-lg">
          <DrawerTitle className="text-primaryText text-fluid-lg">Navigation</DrawerTitle>
        </DrawerHeader>
        
        <div className="p-fluid-lg space-y-3 mobile-scroll overflow-y-auto flex-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center space-x-4 px-4 py-4 rounded-xl text-fluid-base font-medium transition-colors touch-target-large",
                  isActive 
                    ? "bg-accent text-white shadow-sm" 
                    : "text-secondaryText hover:text-primaryText hover:bg-input active:bg-input/80"
                )}
              >
                <Icon className="w-6 h-6 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
          
          <div className="pt-4 border-t border-[rgba(255,255,255,0.05)] mt-6">
            <Link
              to="/"
              onClick={handleLinkClick}
              className="block"
            >
              <Button variant="outline" size="lg" className="w-full touch-target-large">
                <Home className="w-5 h-5 mr-3" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
