
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Save, Wand2 } from 'lucide-react';
import { GenerationResult } from '@/types';
import { MetadataPanel } from './MetadataPanel';

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
  if (!lastResult) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Wand2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Your generated prompt will appear here</p>
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{lastResult.preview_title}</CardTitle>
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

      <MetadataPanel result={lastResult} onRemixSuggestion={onRemixSuggestion} />
    </div>
  );
}
