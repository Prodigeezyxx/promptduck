
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Copy, Save, Wand2, ChevronDown, ChevronRight, BarChart3, Lightbulb } from 'lucide-react';
import { GenerationResult } from '@/types';
import { useState } from 'react';

interface AIGeneratorOutputPanelProps {
  lastResult: GenerationResult | null;
  onCopyPrompt: () => void;
  onSavePrompt: () => void;
  onRemixSuggestion: (suggestion: string) => void;
}

export function AIGeneratorOutputPanel({
  lastResult,
  onCopyPrompt,
  onSavePrompt,
  onRemixSuggestion
}: AIGeneratorOutputPanelProps) {
  const [metadataOpen, setMetadataOpen] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  if (!lastResult) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Wand2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Your generated prompt will appear here</p>
          <p className="text-xs mt-2">Start by describing what you want to achieve</p>
        </div>
      </Card>
    );
  }

  // Clean formatting function to remove asterisks and format nicely
  const formatPromptContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold asterisks
      .replace(/\*(.*?)\*/g, '$1') // Remove italic asterisks
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n\n');
  };

  const formattedPrompt = formatPromptContent(lastResult.optimized_prompt);

  return (
    <div className="space-y-4">
      {/* Main Generated Prompt */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{lastResult.preview_title}</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={onCopyPrompt}>
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={onSavePrompt}>
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/30 p-4 lg:p-6 rounded-lg border">
            <div className="prose prose-sm max-w-none text-foreground">
              {formattedPrompt.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {lastResult.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Collapsible Metadata Section */}
      <Collapsible open={metadataOpen} onOpenChange={setMetadataOpen}>
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Metadata & Quality Metrics
                </CardTitle>
                {metadataOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mt-2">
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-muted-foreground">Complexity:</span>
                  <span className="ml-2 font-medium">{lastResult.metadata.complexity_score}/10</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Creativity:</span>
                  <span className="ml-2 font-medium">{lastResult.metadata.creativity_score}/10</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Coherence:</span>
                  <span className="ml-2 font-medium">{lastResult.metadata.coherence_score}/10</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Est. Tokens:</span>
                  <span className="ml-2 font-medium">{lastResult.metadata.estimated_tokens}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Applied Heuristics:</h4>
                <div className="flex flex-wrap gap-1">
                  {lastResult.heuristics.map((heuristic) => (
                    <Badge key={heuristic} variant="outline" className="text-xs">
                      {heuristic.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Collapsible Remix Suggestions */}
      <Collapsible open={suggestionsOpen} onOpenChange={setSuggestionsOpen}>
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Remix Suggestions ({lastResult.remix_suggestions.length})
                </CardTitle>
                {suggestionsOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mt-2">
            <CardContent className="pt-4">
              <div className="space-y-2">
                {lastResult.remix_suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left h-auto py-3 px-4"
                    onClick={() => onRemixSuggestion(suggestion)}
                  >
                    <div className="text-xs leading-relaxed">{suggestion}</div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
