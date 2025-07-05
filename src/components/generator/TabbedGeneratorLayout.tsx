
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw, Sparkles, Copy, Save, RotateCcw, History, Zap } from 'lucide-react';
import { GenerationResult, ModeType } from '@/types';
import { ModeSelector } from './ModeSelector';
import { OutputActions } from './output/OutputActions';
import { HeuristicsDisplay } from './output/HeuristicsDisplay';
import { RemixSuggestions } from './output/RemixSuggestions';
import { FullscreenPromptModal } from '@/components/playground/FullscreenPromptModal';
import { cn } from '@/lib/utils';

interface TabbedGeneratorLayoutProps {
  intent: string;
  context: string;
  selectedMode: ModeType;
  isGenerating: boolean;
  lastResult: GenerationResult | null;
  history: GenerationResult[];
  onIntentChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onModeChange: (mode: ModeType) => void;
  onGenerate: () => void;
  onCopyPrompt: () => void;
  onSavePrompt: () => void;
  onRemixSuggestion: (suggestion: string) => void;
  onStartNewPrompt: () => void;
  onSelectHistoryResult: (result: GenerationResult) => void;
}

export function TabbedGeneratorLayout({
  intent,
  context,
  selectedMode,
  isGenerating,
  lastResult,
  history,
  onIntentChange,
  onContextChange,
  onModeChange,
  onGenerate,
  onCopyPrompt,
  onSavePrompt,
  onRemixSuggestion,
  onStartNewPrompt,
  onSelectHistoryResult
}: TabbedGeneratorLayoutProps) {
  const [activeTab, setActiveTab] = useState('compose');
  const [contextExpanded, setContextExpanded] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // Auto-switch to results tab when generation completes
  if (lastResult && activeTab === 'compose' && !isGenerating) {
    setActiveTab('results');
  }

  const handleGenerate = () => {
    onGenerate();
    setActiveTab('results');
  };

  const handleSelectHistory = (result: GenerationResult) => {
    onSelectHistoryResult(result);
    setActiveTab('results');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Fixed Height Container with Tabs */}
      <Card className="h-[70vh] flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          {/* Tab Navigation */}
          <div className="flex-shrink-0 border-b bg-muted/30 px-2">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto h-12">
              <TabsTrigger value="compose" className="text-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Compose
              </TabsTrigger>
              <TabsTrigger value="results" className="text-sm" disabled={!lastResult}>
                <Zap className="w-4 h-4 mr-2" />
                Results
              </TabsTrigger>
              <TabsTrigger value="history" className="text-sm">
                <History className="w-4 h-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content - Scrollable */}
          <div className="flex-1 overflow-hidden">
            {/* Compose Tab */}
            <TabsContent value="compose" className="h-full overflow-y-auto p-6 space-y-6 mt-0">
              {/* Mode Selection */}
              <div>
                <label className="text-sm font-medium mb-3 block">Generation Mode</label>
                <ModeSelector selectedMode={selectedMode} onModeChange={onModeChange} />
              </div>

              {/* Intent Input */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  What do you want to achieve? *
                </label>
                <Textarea
                  placeholder="Describe your goal or what you want the prompt to help with..."
                  value={intent}
                  onChange={(e) => onIntentChange(e.target.value)}
                  className="min-h-[120px] max-h-[200px] resize-none"
                  rows={5}
                />
                <div className="flex justify-between items-center mt-2">
                  <div className={cn(
                    "text-xs",
                    intent.length < 50 ? "text-muted-foreground" : 
                    intent.length < 200 ? "text-green-600" : 
                    intent.length < 400 ? "text-amber-600" : "text-red-600"
                  )}>
                    {intent.length} characters
                  </div>
                </div>
              </div>

              {/* Context Input - Collapsible */}
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setContextExpanded(!contextExpanded)}
                  className="text-sm font-medium mb-2 p-0 h-auto hover:bg-transparent"
                >
                  Additional Context (Optional)
                  <span className="ml-2">{contextExpanded ? '−' : '+'}</span>
                </Button>
                {contextExpanded && (
                  <Textarea
                    placeholder="Any specific requirements, constraints, or background information..."
                    value={context}
                    onChange={(e) => onContextChange(e.target.value)}
                    className="min-h-[80px] max-h-[120px] resize-none"
                    rows={3}
                  />
                )}
              </div>
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results" className="h-full overflow-y-auto p-6 space-y-6 mt-0">
              {isGenerating ? (
                <div className="flex items-center justify-center h-40">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
                    <p className="text-muted-foreground">Generating your optimized prompt...</p>
                  </div>
                </div>
              ) : lastResult ? (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Optimized Prompt</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsFullscreenOpen(true)}
                        className="text-xs"
                      >
                        Expand
                      </Button>
                    </div>
                    <Textarea
                      value={lastResult.optimized_prompt}
                      readOnly
                      className="min-h-[200px] max-h-[300px] text-sm leading-relaxed bg-muted/50"
                    />
                  </div>

                  <OutputActions 
                    result={lastResult}
                    onCopyPrompt={onCopyPrompt}
                    onSavePrompt={onSavePrompt}
                  />

                  <HeuristicsDisplay result={lastResult} />

                  <RemixSuggestions 
                    result={lastResult}
                    onRemixSuggestion={onRemixSuggestion}
                  />
                </>
              ) : (
                <div className="flex items-center justify-center h-40">
                  <div className="text-center">
                    <Sparkles className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Generate a prompt to see results here</p>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="h-full overflow-y-auto p-6 mt-0">
              {history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((result, index) => (
                    <Card 
                      key={index} 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSelectHistory(result)}
                    >
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground mb-2">
                          {new Date(result.timestamp || Date.now()).toLocaleString()}
                        </div>
                        <div className="text-sm font-medium mb-2 line-clamp-2">
                          {result.intent}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {result.optimized_prompt.substring(0, 100)}...
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40">
                  <div className="text-center">
                    <History className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No generation history yet</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </Card>

      {/* Floating Action Bar */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t mt-4 p-4 -mx-4">
        <div className="flex items-center justify-center gap-3">
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !intent.trim()}
            className="bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 h-12 px-8"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Prompt
              </>
            )}
          </Button>

          {lastResult && (
            <>
              <Button variant="outline" size="lg" onClick={onCopyPrompt} className="h-12">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="lg" onClick={onSavePrompt} className="h-12">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </>
          )}

          <Button variant="ghost" size="lg" onClick={onStartNewPrompt} className="h-12">
            <RotateCcw className="w-4 h-4 mr-2" />
            New
          </Button>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {lastResult && (
        <FullscreenPromptModal
          open={isFullscreenOpen}
          onOpenChange={setIsFullscreenOpen}
          content={lastResult.optimized_prompt}
          title="Optimized Prompt"
        />
      )}
    </div>
  );
}
