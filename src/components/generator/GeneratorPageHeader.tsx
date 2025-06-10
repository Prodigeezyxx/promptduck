
import { Button } from '@/components/ui/button';
import { CreditDisplay } from '@/components/CreditDisplay';
import { useIsMobile } from '@/hooks/use-mobile';
import { Wand2, History } from 'lucide-react';

interface GeneratorPageHeaderProps {
  onHistoryOpen: () => void;
}

export function GeneratorPageHeader({ onHistoryOpen }: GeneratorPageHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <div className="mb-6 lg:mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center">
            <Wand2 className="w-6 h-6 lg:w-8 lg:h-8 mr-2 lg:mr-3 text-brand-500" />
            AI Prompt Generator
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Transform your ideas using intelligently selected cognitive heuristics
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onHistoryOpen}
          className="flex items-center gap-2"
        >
          <History className="w-4 h-4" />
          History
        </Button>
      </div>
      
      {/* Mobile Credit Display */}
      {isMobile && (
        <div className="mb-4">
          <CreditDisplay />
        </div>
      )}
    </div>
  );
}
