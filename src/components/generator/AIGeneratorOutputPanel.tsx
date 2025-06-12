
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { GenerationResult } from '@/types';
import { OutputHeader } from './output/OutputHeader';
import { OutputActions } from './output/OutputActions';
import { HeuristicsDisplay } from './output/HeuristicsDisplay';
import { RemixSuggestions } from './output/RemixSuggestions';
import { OutputMetadata } from './output/OutputMetadata';
import { EmptyState } from './output/EmptyState';
import { LoadingState } from './output/LoadingState';

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
  if (isGenerating) {
    return (
      <Card className="h-full border-dashed border-2 border-brand-200 dark:border-brand-800">
        <CardContent className="flex items-center justify-center h-full">
          <LoadingState />
        </CardContent>
      </Card>
    );
  }

  if (!lastResult) {
    return (
      <Card className="h-full border-dashed border-2 border-gray-200 dark:border-gray-800">
        <CardContent className="flex items-center justify-center h-full">
          <EmptyState />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          <OutputHeader result={lastResult} />
        </CardTitle>
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
        <OutputActions 
          result={lastResult}
          onCopyPrompt={onCopyPrompt}
          onSavePrompt={onSavePrompt}
        />

        {/* Heuristics Applied */}
        <HeuristicsDisplay result={lastResult} />

        {/* Remix Suggestions */}
        <RemixSuggestions 
          result={lastResult}
          onRemixSuggestion={onRemixSuggestion}
        />

        {/* Metadata */}
        <OutputMetadata result={lastResult} />
      </CardContent>
    </Card>
  );
}
