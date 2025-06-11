import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Copy, Save, ChevronDown, ChevronRight, Sparkles, PlayCircle, RefreshCw, Download } from 'lucide-react';
import { GenerationResult } from '@/types';
import { usePromptStore } from '@/store/promptStore';
import { downloadPromptAsJSON } from '@/utils/promptExporter';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AIGeneratorOutputPanelProps {
  lastResult: GenerationResult | null;
  isGenerating?: boolean;
  onCopyPrompt: () => void;
  onSavePrompt: () => void;
  onRemixSuggestion: (suggestion: string) => void;
}

export function AIGeneratorOutputPanel({
  lastResult,
  isGenerating = false,
  onCopyPrompt,
  onSavePrompt,
  onRemixSuggestion
}: AIGeneratorOutputPanelProps) {
  const navigate = useNavigate();
  const [isRemixOpen, setIsRemixOpen] = useState(false);
  const { prompts } = usePromptStore();
  const { toast } = useToast();

  const handleTestInPlayground = () => {
    if (lastResult) {
      // Navigate with state to pre-fill the playground input
      navigate('/app/playground', { 
        state: { prefilledPrompt: lastResult.optimized_prompt }
      });
    }
  };

  const handleDownloadJSON = () => {
    if (lastResult) {
      // Create a temporary prompt object for download
      const tempPrompt = {
        id: 'temp-' + Date.now(),
        title: lastResult.preview_title,
        content: lastResult.optimized_prompt,
        description: lastResult.preview_title,
        tags: lastResult.tags,
        persona: 'creator' as const,
        heuristics: lastResult.heuristics,
        variables: lastResult.variables,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 1,
        usage_count: 0,
        category: 'general' as const
      };
      
      downloadPromptAsJSON(tempPrompt);
      toast({
        title: "Download started",
        description: "Your prompt has been downloaded as a JSON file."
      });
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

  if (!lastResult) {
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
          {lastResult.preview_title}
        </CardTitle>
        <div className="flex flex-wrap gap-1">
          {lastResult.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {lastResult.tags.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{lastResult.tags.length - 4} more
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Optimized Prompt */}
        <div>
          <label className="text-sm font-medium mb-2 block">Optimized Prompt</label>
          <Textarea
            value={lastResult.optimized_prompt}
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
          <Button onClick={handleDownloadJSON} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            JSON
          </Button>
        </div>

        {/* Heuristics Applied */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Applied Heuristics ({lastResult.heuristics.length})
          </label>
          <div className="flex flex-wrap gap-1">
            {lastResult.heuristics.map((heuristic) => (
              <span 
                key={heuristic} 
                className="heuristic-tag text-xs px-2 py-1 bg-accent rounded-md"
              >
                {heuristic}
              </span>
            ))}
          </div>
        </div>

        {/* Remix Suggestions - Improved Formatting */}
        {lastResult.remix_suggestions && lastResult.remix_suggestions.length > 0 && (
          <Collapsible open={isRemixOpen} onOpenChange={setIsRemixOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                <span className="text-sm font-medium">
                  Remix Suggestions ({lastResult.remix_suggestions.length})
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
                  {lastResult.remix_suggestions.map((suggestion, index) => (
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
        )}

        {/* Metadata */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <div className="flex justify-between">
            <span>Estimated tokens:</span>
            <span>{lastResult.metadata.estimated_tokens}</span>
          </div>
          <div className="flex justify-between">
            <span>Confidence:</span>
            <span>{Math.round(lastResult.metadata.confidence_score * 100)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Generation time:</span>
            <span>{lastResult.metadata.generation_time_ms}ms</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
