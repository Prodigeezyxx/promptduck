
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GenerationResult } from '@/types';
import { OutputHeader } from './output/OutputHeader';
import { OutputActions } from './output/OutputActions';
import { HeuristicsDisplay } from './output/HeuristicsDisplay';
import { RemixSuggestions } from './output/RemixSuggestions';
import { OutputMetadata } from './output/OutputMetadata';
import { FullscreenPromptModal } from '@/components/playground/FullscreenPromptModal';
import { 
  Expand, 
  Copy, 
  Save, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Target,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedAIGeneratorOutputPanelProps {
  lastResult: GenerationResult | null;
  isGenerating?: boolean;
  onCopyPrompt: () => void;
  onSavePrompt: () => void;
  onRemixSuggestion: (suggestion: string) => void;
}

function EnhancedLoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-8 space-y-6"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-brand-200 border-t-brand-500 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-brand-500" />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-brand-900">Crafting Your Optimized Prompt</h3>
        <p className="text-gray-600">Applying cognitive heuristics and best practices...</p>
      </div>

      <div className="w-full max-w-md space-y-3">
        <div className="flex items-center space-x-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="w-2 h-2 bg-green-500 rounded-full"
          />
          <span className="text-sm text-gray-700">Analyzing intent and context</span>
        </div>
        <div className="flex items-center space-x-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 }}
            className="w-2 h-2 bg-green-500 rounded-full"
          />
          <span className="text-sm text-gray-700">Selecting optimal heuristics</span>
        </div>
        <div className="flex items-center space-x-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5 }}
            className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"
          />
          <span className="text-sm text-gray-700">Generating optimized prompt</span>
        </div>
      </div>
    </motion.div>
  );
}

function EnhancedEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 space-y-6 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-brand-100 to-purple-100 rounded-full flex items-center justify-center">
        <Target className="w-10 h-10 text-brand-500" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">Ready to Create Your Prompt</h3>
        <p className="text-gray-600 max-w-sm">
          Complete the form on the left to generate an optimized, professional-grade prompt using AI and cognitive science.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="bg-blue-50 p-4 rounded-lg">
          <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="font-medium text-blue-900">Optimized</div>
          <div className="text-blue-700">AI-enhanced for better results</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <Sparkles className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="font-medium text-green-900">Smart</div>
          <div className="text-green-700">Cognitive heuristics applied</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <Clock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <div className="font-medium text-purple-900">Fast</div>
          <div className="text-purple-700">Generated in seconds</div>
        </div>
      </div>
    </motion.div>
  );
}

export function EnhancedAIGeneratorOutputPanel({
  lastResult,
  isGenerating = false,
  onCopyPrompt,
  onSavePrompt,
  onRemixSuggestion
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
      <Card className="h-full border-dashed border-2 border-brand-200 dark:border-brand-800">
        <CardContent className="flex items-center justify-center h-full">
          <EnhancedLoadingState />
        </CardContent>
      </Card>
    );
  }

  if (!lastResult) {
    return (
      <Card className="h-full border-dashed border-2 border-gray-200 dark:border-gray-800">
        <CardContent className="flex items-center justify-center h-full">
          <EnhancedEmptyState />
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="h-full">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
            <CardTitle className="flex items-center space-x-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <CheckCircle className="w-6 h-6 text-green-500" />
              </motion.div>
              <div>
                <OutputHeader result={lastResult} />
                <Badge className="bg-green-100 text-green-800 mt-1">
                  ✨ Optimized & Ready
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 p-6">
            {/* Quality Score */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-blue-900">Quality Assessment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    Score: {lastResult.heuristics?.length || 0}/10
                  </Badge>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertCircle className="w-4 h-4 text-blue-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Based on applied heuristics and optimization techniques</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </motion.div>

            {/* Optimized Prompt */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-900">Your Optimized Prompt</label>
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
                      <p>View in fullscreen for better reading</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <Textarea
                value={lastResult.optimized_prompt}
                readOnly
                className="min-h-[140px] text-sm leading-relaxed resize-none font-mono bg-gray-50 border-gray-200"
              />
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3"
            >
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
            </motion.div>

            {/* Heuristics Applied */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <HeuristicsDisplay result={lastResult} />
            </motion.div>

            {/* Remix Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <RemixSuggestions 
                result={lastResult}
                onRemixSuggestion={onRemixSuggestion}
              />
            </motion.div>

            {/* Metadata */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <OutputMetadata result={lastResult} />
            </motion.div>
          </CardContent>
        </Card>

        {/* Fullscreen Modal */}
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
