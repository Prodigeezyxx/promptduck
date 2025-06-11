
import { PlayCircle, LayoutPanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatInterface } from '@/components/playground/ChatInterface';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUiStore } from '@/store/uiStore';
import { DuckIcon } from '@/components/icons/DuckIcon';

export default function PlaygroundPage() {
  const isMobile = useIsMobile();
  const { sidebarVisible, toggleSidebar } = useUiStore();

  return (
    <div className="flex flex-col h-full dark:bg-gray-950">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-gray-950/95 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
              {!isMobile && !sidebarVisible && (
                <div className="flex items-center gap-2">
                  <DuckIcon size={24} />
                  <span className="text-lg font-bold gradient-text">PromptDuck</span>
                </div>
              )}
              <div>
                <h1 className="text-xl lg:text-2xl font-bold flex items-center">
                  <PlayCircle className="w-5 h-5 lg:w-6 lg:h-6 mr-2 text-brand-500" />
                  Prompt Playground
                </h1>
                <p className="text-sm text-muted-foreground">
                  Test and experiment with prompts using Advanced AI
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>
    </div>
  );
}
