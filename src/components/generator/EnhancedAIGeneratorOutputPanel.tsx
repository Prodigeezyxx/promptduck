import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GenerationResult } from '@/types';
import { OutputActions } from './output/OutputActions';
import { OutputMetadata } from './output/OutputMetadata';
import { BuilderModeDisplay } from './output/BuilderModeDisplay';
import { BuilderActions } from './output/BuilderActions';
import { FullscreenPromptModal } from '@/components/playground/FullscreenPromptModal';
import { EmptyState } from './output/EmptyState';
import { LoadingState } from './output/LoadingState';
import { 
  Expand, 
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

interface EnhancedAIGeneratorOutputPanelProps {
  lastResult: GenerationResult | null;
  isGenerating?: boolean;
  onCopyPrompt: () => void;
  onSavePrompt: () => void;
  onRemixSuggestion: (suggestion: string) => void;
  onStartNewPrompt: () => void;
  originalIntent?: string;
  originalContext?: string;
  selectedMode?: string;
}

export function EnhancedAIGeneratorOutputPanel({
  lastResult,
  isGenerating = false,
  onCopyPrompt,
  onSavePrompt,
  onRemixSuggestion,
  onStartNewPrompt,
  originalIntent = '',
  originalContext = '',
  selectedMode = 'general'
}: EnhancedAIGeneratorOutputPanelProps) {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  
  const isBuilderMode = selectedMode === 'builder';

  if (isGenerating) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full p-6">
          <LoadingState 
            intent={originalIntent} 
            context={originalContext} 
            mode={selectedMode as any}
          />
        </CardContent>
      </Card>
    );
  }

  if (!lastResult) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <EmptyState />
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="h-full">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center space-x-2">
              <span className="font-semibold text-lg">
                {lastResult.preview_title}
              </span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-200px)] p-6">
              <div className="space-y-6">
                {/* Builder Mode Intelligence Display */}
                {isBuilderMode && (
                  <BuilderModeDisplay result={lastResult} />
                )}

                {/* Optimized Prompt */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold">
                      {isBuilderMode ? 'R-T-C-F-G Enhanced Prompt' : 'Your Enhanced Prompt'}
                    </label>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {lastResult.optimized_prompt.length} characters
                      </Badge>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsFullscreenOpen(true)}
                            className="h-8 px-2 text-xs"
                          >
                            <Expand className="w-3 h-3 mr-1" />
                            Expand
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View your enhanced prompt in fullscreen</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                    <div
                      className="min-h-[130px] px-4 py-3 rounded-lg bg-muted/30 text-sm leading-relaxed whitespace-pre-wrap border"
                    >
                      {lastResult.optimized_prompt}
                    </div>
                </div>

                {/* Action Buttons - Mode-Specific */}
                {isBuilderMode ? (
                  <BuilderActions
                    result={lastResult}
                    originalIntent={originalIntent}
                    originalContext={originalContext}
                    onCopyPrompt={onCopyPrompt}
                    onSavePrompt={onSavePrompt}
                  />
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={onCopyPrompt} variant="outline" className="flex-1">
                      Copy Prompt
                    </Button>
                    <Button onClick={onSavePrompt} variant="outline" className="flex-1">
                      Save to Library
                    </Button>
                  </div>
                )}

                {/* Additional Actions for non-Builder modes */}
                {!isBuilderMode && (
                  <OutputActions 
                    result={lastResult}
                    onCopyPrompt={onCopyPrompt}
                    onSavePrompt={onSavePrompt}
                  />
                )}

                {/* Remix Suggestions */}
                {lastResult.remix_suggestions && lastResult.remix_suggestions.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold mb-3 block">
                      {isBuilderMode ? 'Enhancement Suggestions' : 'Remix Suggestions'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {lastResult.remix_suggestions.slice(0, isBuilderMode ? 4 : 6).map((remix, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          onClick={() => onRemixSuggestion(remix)}
                          className="text-xs hover:bg-accent transition-colors"
                        >
                          {remix}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Start New Prompt Button */}
                <div className="pt-4 border-t">
                  <Button 
                    onClick={onStartNewPrompt}
                    className="w-full"
                    size="lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Start New Prompt
                  </Button>
                </div>

                {/* Metadata */}
                <OutputMetadata result={lastResult} />
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <FullscreenPromptModal
          open={isFullscreenOpen}
          onOpenChange={setIsFullscreenOpen}
          content={lastResult.optimized_prompt}
          title="Enhanced Prompt"
        />
      </motion.div>
    </TooltipProvider>
  );
}
