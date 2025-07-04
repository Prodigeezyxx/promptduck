
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CreditDisplay } from '@/components/CreditDisplay';
import { Settings, FileText, Zap, Lightbulb, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface SideNavProps {
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  intent: string;
  context: string;
}

const navItems = [
  { id: 'mode', label: 'Mode', icon: Settings },
  { id: 'input', label: 'Input', icon: FileText },
  { id: 'output', label: 'Output', icon: Zap },
  { id: 'suggestions', label: 'Suggestions', icon: Lightbulb }
];

export function CompactSideNav({ activeSection, onSectionClick, intent, context }: SideNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const isMobile = useIsMobile();

  // Calculate approximate token count
  useEffect(() => {
    const text = `${intent} ${context}`.trim();
    const approximateTokens = Math.ceil(text.length / 4); // Rough estimation
    setTokenCount(approximateTokens);
  }, [intent, context]);

  if (isMobile) {
    return (
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-background/95 backdrop-blur-sm"
        >
          {isCollapsed ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
        
        {isCollapsed && (
          <div className="absolute top-12 left-0 bg-background/95 backdrop-blur-sm border rounded-lg p-2 min-w-[200px]">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "secondary" : "ghost"}
                  onClick={() => {
                    onSectionClick(item.id);
                    setIsCollapsed(false);
                  }}
                  className="w-full justify-start text-sm"
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>
            
            <Separator className="my-3" />
            
            <div className="space-y-2 text-xs text-muted-foreground">
              <div>Tokens: {tokenCount.toLocaleString()}</div>
              <CreditDisplay />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "fixed left-0 top-20 h-[calc(100vh-5rem)] bg-background/95 backdrop-blur-sm border-r transition-all duration-300 z-40",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <h3 className="font-semibold text-sm">Navigation</h3>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "secondary" : "ghost"}
              onClick={() => onSectionClick(item.id)}
              className={cn(
                "w-full justify-start transition-all",
                isCollapsed ? "px-2" : "px-3"
              )}
            >
              <item.icon className="w-4 h-4" />
              {!isCollapsed && <span className="ml-2 text-sm">{item.label}</span>}
            </Button>
          ))}
        </nav>

        {!isCollapsed && (
          <>
            <Separator className="my-4" />
            
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Tokens:</span>
                  <span className="font-mono">{tokenCount.toLocaleString()}</span>
                </div>
              </div>
              
              <CreditDisplay />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
