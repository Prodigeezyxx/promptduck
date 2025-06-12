
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, RefreshCw } from 'lucide-react';
import { GenerationResult } from '@/types';
import { cn } from '@/lib/utils';

interface RemixSuggestionsProps {
  result: GenerationResult;
  onRemixSuggestion: (suggestion: string) => void;
}

export function RemixSuggestions({ result, onRemixSuggestion }: RemixSuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!result.remix_suggestions || result.remix_suggestions.length === 0) {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-2 h-auto">
          <span className="text-sm font-medium">
            Remix Suggestions ({result.remix_suggestions.length})
          </span>
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <ScrollArea className="h-32">
          <div className="space-y-2 pr-4">
            {result.remix_suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 text-sm border rounded-lg cursor-pointer transition-all duration-200",
                  "hover:bg-muted/50 hover:border-brand-300 dark:hover:border-brand-600",
                  "bg-card dark:bg-card/50 border-border dark:border-gray-700"
                )}
                onClick={() => onRemixSuggestion(suggestion)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed break-words">
                      {suggestion}
                    </p>
                  </div>
                  <RefreshCw className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
}
