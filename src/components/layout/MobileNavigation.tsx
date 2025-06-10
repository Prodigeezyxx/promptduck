
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
  Code,
  Home
} from 'lucide-react';

const navigation = [
  { name: 'Library', href: '/app/library', icon: BookOpen },
  { name: 'Generator', href: '/app/generator', icon: Wand2 },
  { name: 'Playground', href: '/app/playground', icon: PlayCircle },
  { name: 'System Editor', href: '/app/system-editor', icon: Code },
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
      <DrawerContent className="h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
        </DrawerHeader>
        
        <div className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors touch-target",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          
          <div className="pt-4 border-t border-border">
            <Link
              to="/"
              onClick={handleLinkClick}
              className="flex items-center justify-center py-3"
            >
              <Button variant="outline" size="sm" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
