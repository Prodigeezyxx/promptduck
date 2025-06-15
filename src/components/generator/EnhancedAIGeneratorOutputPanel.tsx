import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <Card className="h-full bg-background text-primary border border-border shadow-none">
          <CardHeader className="border-b bg-background">
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="font-semibold text-lg text-neutral-200" style={{fontWeight: 500, letterSpacing: '-0.01em'}}>
                {lastResult.preview_title}
              </span>
              <Badge className="bg-green-800/20 text-green-400 ml-2 font-normal" variant="secondary">
                Optimized
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 p-6">
            {/* Optimized Prompt */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-neutral-300">Your Optimized Prompt</label>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs border border-primary/10 text-neutral-400 bg-transparent">
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
              {/* Output as clean, formatted text */}
              <div
                className="min-h-[130px] px-4 py-3 rounded-lg bg-[#16181c] text-sm leading-relaxed text-gray-100 shadow-sm border border-border font-sans whitespace-pre-wrap"
                style={{
                  fontSize: "0.98rem",
                  lineHeight: 1.7,
                  letterSpacing: '-0.01em',
                  wordBreak: "break-word"
                }}
              >
                {lastResult.optimized_prompt}
              </div>
            </motion.div>

            {/* Enhanced Action Buttons (includes JSON Download) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
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
              {/* JSON Download Button */}
              <OutputActions 
                result={lastResult}
                onCopyPrompt={handleCopy}
                onSavePrompt={handleSave}
              />
            </motion.div>

            {/* Remix Suggestions as visually distinct row (replacing heuristics display) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.43 }}
            >
              {lastResult.remix_suggestions && lastResult.remix_suggestions.length > 0 && (
                <div>
                  <label className="text-sm font-semibold mb-2 block text-indigo-400">
                    Remix Suggestions ({lastResult.remix_suggestions.length})
                  </label>
                  <div className="flex flex-wrap gap-3 mt-1 mb-1">
                    {lastResult.remix_suggestions.map((remix, idx) => (
                      <span
                        key={idx}
                        className="px-5 py-2 bg-indigo-400/60 text-indigo-100 rounded-2xl text-sm cursor-pointer hover:bg-indigo-500/70 transition font-medium"
                        style={{minWidth: '120px', textAlign: 'center'}}
                        onClick={() => onRemixSuggestion(remix)}
                      >
                        {remix}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Metadata */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
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
