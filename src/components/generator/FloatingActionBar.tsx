
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CreditDisplay } from '@/components/CreditDisplay';
import { RefreshCw, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface FloatingActionBarProps {
  isGenerating: boolean;
  onGenerate: () => void;
  canGenerate: boolean;
  tokenCount: number;
}

export function FloatingActionBar({
  isGenerating,
  onGenerate,
  canGenerate,
  tokenCount
}: FloatingActionBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show when scrolling down past 200px
      if (currentScrollY > 200 && currentScrollY > lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY && currentScrollY < 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t transition-all duration-300 z-50",
      isVisible ? "translate-y-0" : "translate-y-full"
    )}>
      <div className={cn(
        "container mx-auto px-4 py-3",
        isMobile ? "max-w-full" : "max-w-7xl"
      )}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <CreditDisplay />
            <div className="hidden sm:block">
              Tokens: <span className="font-mono">{tokenCount.toLocaleString()}</span>
            </div>
          </div>

          <Button
            onClick={onGenerate}
            disabled={isGenerating || !canGenerate}
            className="bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 min-h-[44px] px-6"
            size={isMobile ? "default" : "lg"}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
