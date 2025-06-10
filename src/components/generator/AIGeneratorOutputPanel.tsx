
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Copy, Save, ChevronDown, ChevronRight, Sparkles, PlayCircle, RefreshCw } from 'lucide-react';
import { GenerationResult } from '@/types';
import { cn } from '@/lib/utils';
import { usePlaygroundConversation } from '@/hooks/usePlaygroundConversation';

interface AIGeneratorOutputPanelProps {
  result: GenerationResult | null;
  isGenerating: boolean;
  onCopyPrompt: () => void;
  onSavePrompt: () => void;
  onRemixSuggestion: (suggestion: string) => void;
}

export function AIGeneratorOutputPanel({
  result,
  isGenerating,
  onCopyPrompt,
  onSavePrompt,
  onRemixSuggestion
}: AIGeneratorOutputPanelProps) {
  const navigate = useNavigate();
  const [isRemixOpen, setIsRemixOpen] = useState(false);
  const { setCurrentInput } = usePlaygroundConversation();

  const handleTestInPlayground = () => {
    if (result) {
      // Set the prompt in playground and navigate
      setCurrentInput(result.optimized_prompt);
      navigate('/app/playground');
    }
  };

  if (isGenerating) {
    return (
      <Card className="h-full border-dashed border-2 border-brand-200 dark:border-brand-800">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
            <p className="text-sm text-muted-foreground">
              Generating your optimized prompt...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="h-full border-dashed border-2 border-gray-200 dark:border-gray-800">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium mb-2">Ready to generate</h3>
              <p className="text-sm text-muted-foreground">
                Your optimized prompt will appear here
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-brand-500" />
          {result.preview_title}
        </CardTitle>
        <div className="flex flex-wrap gap-1">
          {result.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {result.tags.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{result.tags.length - 4} more
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Optimized Prompt */}
        <div>
          <label className="text-sm font-medium mb-2 block">Optimized Prompt</label>
          <Textarea
            value={result.optimized_prompt}
            readOnly
            className="min-h-[120px] text-sm leading-relaxed resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={handleTestInPlayground}
            className="bg-brand-500 hover:bg-brand-600 text-white flex-1 sm:flex-none"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            Test in Playground
          </Button>
          <Button onClick={onCopyPrompt} variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button onClick={onSavePrompt} variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>

        {/* Heuristics Applied */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Applied Heuristics ({result.heuristics.length})
          </label>
          <div className="flex flex-wrap gap-1">
            {result.heuristics.map((heuristic) => (
              <span 
                key={heuristic} 
                className="heuristic-tag text-xs px-2 py-1 bg-accent rounded-md"
              >
                {heuristic}
              </span>
            ))}
          </div>
        </div>

        {/* Remix Suggestions */}
        {result.remix_suggestions && result.remix_suggestions.length > 0 && (
          <Collapsible open={isRemixOpen} onOpenChange={setIsRemixOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                <span className="text-sm font-medium">
                  Remix Suggestions ({result.remix_suggestions.length})
                </span>
                {isRemixOpen ? (
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
                        "p-2 text-xs border rounded cursor-pointer",
                        "hover:bg-muted/50 transition-colors"
                      )}
                      onClick={() => onRemixSuggestion(suggestion)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="flex-1">{suggestion}</span>
                        <RefreshCw className="w-3 h-3 text-muted-foreground shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Metadata */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <div className="flex justify-between">
            <span>Estimated tokens:</span>
            <span>{result.metadata.estimated_tokens}</span>
          </div>
          <div className="flex justify-between">
            <span>Confidence:</span>
            <span>{Math.round(result.metadata.confidence_score * 100)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Generation time:</span>
            <span>{result.metadata.generation_time_ms}ms</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
