
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GenerationResult } from '@/types';

interface MetadataPanelProps {
  result: GenerationResult;
  onRemixSuggestion: (suggestion: string) => void;
}

export function MetadataPanel({ result, onRemixSuggestion }: MetadataPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Metadata & Suggestions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Complexity:</span>
            <span className="ml-2 font-medium">{result.metadata.complexity_score}/10</span>
          </div>
          <div>
            <span className="text-muted-foreground">Creativity:</span>
            <span className="ml-2 font-medium">{result.metadata.creativity_score}/10</span>
          </div>
          <div>
            <span className="text-muted-foreground">Coherence:</span>
            <span className="ml-2 font-medium">{result.metadata.coherence_score}/10</span>
          </div>
          <div>
            <span className="text-muted-foreground">Est. Tokens:</span>
            <span className="ml-2 font-medium">{result.metadata.estimated_tokens}</span>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Remix Suggestions:</h4>
          <div className="space-y-2">
            {result.remix_suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full justify-start text-left h-auto py-2"
                onClick={() => onRemixSuggestion(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
