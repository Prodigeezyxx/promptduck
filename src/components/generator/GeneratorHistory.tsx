
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { History, ChevronDown, ChevronRight, Copy, Trash2 } from 'lucide-react';
import { useGeneratorStore } from '@/store/generatorStore';
import { GenerationResult } from '@/types';
import { toast } from '@/hooks/use-toast';

interface GeneratorHistoryProps {
  onSelectResult: (result: GenerationResult) => void;
}

export function GeneratorHistory({ onSelectResult }: GeneratorHistoryProps) {
  const { history, clearHistory } = useGeneratorStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyPrompt = (prompt: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt);
    toast({ title: 'Copied!', description: 'Prompt copied to clipboard.' });
  };

  const handleClearHistory = () => {
    clearHistory();
    toast({ title: 'Cleared!', description: 'History cleared successfully.' });
  };

  if (history.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center text-sm">
            <History className="w-4 h-4 mr-2" />
            History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No generations yet. Start creating prompts to see your history here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-sm">
            <History className="w-4 h-4 mr-2" />
            History ({history.length})
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearHistory}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="p-4 space-y-2">
            {history.map((result, index) => (
              <Collapsible key={index}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-2 h-auto text-left"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {result.preview_title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {result.heuristics.length} heuristics
                      </p>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-2 pb-2">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {result.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-6 px-2"
                        onClick={() => onSelectResult(result)}
                      >
                        Load
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-6 px-2"
                        onClick={(e) => handleCopyPrompt(result.optimized_prompt, e)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
