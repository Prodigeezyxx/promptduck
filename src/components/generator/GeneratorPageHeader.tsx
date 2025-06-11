
import { Button } from '@/components/ui/button';
import { CreditDisplay } from '@/components/CreditDisplay';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUiStore } from '@/store/uiStore';
import { Wand2, History, LayoutPanelLeft } from 'lucide-react';

interface GeneratorPageHeaderProps {
  onHistoryOpen: () => void;
}

export function GeneratorPageHeader({ onHistoryOpen }: GeneratorPageHeaderProps) {
  const isMobile = useIsMobile();
  const { sidebarVisible, toggleSidebar } = useUiStore();

  return (
    <div className="mb-6 lg:mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {!isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSidebar}
              className="flex items-center gap-2"
              aria-label={sidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
            >
              <LayoutPanelLeft className={`w-4 h-4 transition-transform ${!sidebarVisible ? 'rotate-180' : ''}`} />
            </Button>
          )}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold flex items-center">
              <Wand2 className="w-6 h-6 lg:w-8 lg:h-8 mr-2 lg:mr-3 text-brand-500" />
              AI Prompt Generator
            </h1>
            <p className="text-sm lg:text-base text-muted-foreground">
              Transform your ideas using intelligently selected cognitive heuristics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
