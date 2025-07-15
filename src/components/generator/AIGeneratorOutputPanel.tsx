
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
import { FullscreenPromptModal } from '@/components/playground/FullscreenPromptModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Expand } from 'lucide-react';

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
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

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
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>
            <OutputHeader result={lastResult} />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Enhanced Prompt with Expand Button */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold">Your Enhanced Prompt</label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreenOpen(true)}
                className="h-8 px-2 text-xs"
              >
                <Expand className="w-3 h-3 mr-1" />
                Expand
              </Button>
            </div>
            <Textarea
              value={lastResult.optimized_prompt}
              readOnly
              className="min-h-[120px] text-sm leading-relaxed resize-none bg-muted/30"
              placeholder="Your enhanced prompt will appear here..."
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

      {/* Fullscreen Modal */}
      <FullscreenPromptModal
        open={isFullscreenOpen}
        onOpenChange={setIsFullscreenOpen}
        content={lastResult.optimized_prompt}
        title="Enhanced Prompt"
      />
    </>
  );
}
