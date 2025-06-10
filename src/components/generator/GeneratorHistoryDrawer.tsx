
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { History, ChevronDown, ChevronRight, Copy, Trash2, X } from 'lucide-react';
import { useGeneratorStore } from '@/store/generatorStore';
import { GenerationResult } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface GeneratorHistoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectResult: (result: GenerationResult) => void;
}

export function GeneratorHistoryDrawer({ 
  open, 
  onOpenChange, 
  onSelectResult 
}: GeneratorHistoryDrawerProps) {
  const { history, clearHistory } = useGeneratorStore();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const isMobile = useIsMobile();

  const handleCopyPrompt = (prompt: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt);
    toast({ title: 'Copied!', description: 'Prompt copied to clipboard.' });
  };

  const handleClearHistory = () => {
    clearHistory();
    toast({ title: 'Cleared!', description: 'History cleared successfully.' });
  };

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const historyContent = (
    <div className="p-4">
      {history.length === 0 ? (
        <div className="text-center py-8">
          <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm text-muted-foreground">
            No generations yet. Start creating prompts to see your history here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">
              {history.length} generation{history.length !== 1 ? 's' : ''}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearHistory}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          </div>
          
          <ScrollArea className="h-[60vh]">
            <div className="space-y-2">
              {history.map((result, index) => (
                <div key={index} className="border rounded-lg p-3 bg-card">
                  <Collapsible 
                    open={expandedItems.has(index)}
                    onOpenChange={() => toggleExpanded(index)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-2 h-auto text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {result.preview_title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {result.heuristics.length} heuristics • {result.metadata.estimated_tokens} tokens
                          </p>
                        </div>
                        {expandedItems.has(index) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-2 pb-2">
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {result.tags.slice(0, 5).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {result.tags.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{result.tags.length - 5} more
                            </Badge>
                          )}
                        </div>
                        
                        <div className="bg-muted/30 p-3 rounded text-xs leading-relaxed max-h-32 overflow-y-auto">
                          {result.optimized_prompt.length > 200 
                            ? `${result.optimized_prompt.substring(0, 200)}...` 
                            : result.optimized_prompt
                          }
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 px-3 flex-1"
                            onClick={() => {
                              onSelectResult(result);
                              onOpenChange(false);
                            }}
                          >
                            Load
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 px-3"
                            onClick={(e) => handleCopyPrompt(result.optimized_prompt, e)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="flex items-center">
              <History className="w-5 h-5 mr-2" />
              Generation History
            </DrawerTitle>
          </DrawerHeader>
          {historyContent}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <History className="w-5 h-5 mr-2" />
            Generation History
          </SheetTitle>
        </SheetHeader>
        {historyContent}
      </SheetContent>
    </Sheet>
  );
}
