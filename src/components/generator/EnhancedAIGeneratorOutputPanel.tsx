
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GenerationResult } from '@/types';
import { OutputActions } from './output/OutputActions';
import { OutputMetadata } from './output/OutputMetadata';
import { FullscreenPromptModal } from '@/components/playground/FullscreenPromptModal';
import { EmptyState } from './output/EmptyState';
import { LoadingState } from './output/LoadingState';
import { 
  Expand, 
  Copy, 
  Save, 
  CheckCircle,
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
}

export function EnhancedAIGeneratorOutputPanel({
  lastResult,
  isGenerating = false,
  onCopyPrompt,
  onSavePrompt,
  onRemixSuggestion,
  onStartNewPrompt
}: EnhancedAIGeneratorOutputPanelProps) {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCopy = () => {
    onCopyPrompt();
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSave = () => {
    onSavePrompt();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  if (isGenerating) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <LoadingState />
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
          
          <CardContent className="space-y-6 p-6">
            {/* Optimized Prompt */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold">Your Optimized Prompt</label>
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
                      <p>View in fullscreen</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div
                className="min-h-[130px] px-4 py-3 rounded-lg bg-muted text-sm leading-relaxed whitespace-pre-wrap border"
              >
                {lastResult.optimized_prompt}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleCopy}
                className={`flex-1 min-w-[120px] transition-all ${
                  copySuccess ? 'bg-green-500 hover:bg-green-600' : ''
                }`}
                variant={copySuccess ? "default" : "outline"}
              >
                {copySuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Prompt
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleSave}
                className={`flex-1 min-w-[120px] transition-all ${
                  saveSuccess ? 'bg-green-500 hover:bg-green-600' : ''
                }`}
                variant={saveSuccess ? "default" : "outline"}
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save to Library
                  </>
                )}
              </Button>
            </div>

            {/* Additional Actions */}
            <OutputActions 
              result={lastResult}
              onCopyPrompt={handleCopy}
              onSavePrompt={handleSave}
            />

            {/* Remix Suggestions */}
            {lastResult.remix_suggestions && lastResult.remix_suggestions.length > 0 && (
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Remix Suggestions
                </label>
                <div className="flex flex-wrap gap-2">
                  {lastResult.remix_suggestions.map((remix, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => onRemixSuggestion(remix)}
                      className="text-xs"
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
          </CardContent>
        </Card>

        <FullscreenPromptModal
          open={isFullscreenOpen}
          onOpenChange={setIsFullscreenOpen}
          content={lastResult.optimized_prompt}
          title="Optimized Prompt"
        />
      </motion.div>
    </TooltipProvider>
  );
}
