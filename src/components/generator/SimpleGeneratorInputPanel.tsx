
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, RefreshCw, X, Info } from 'lucide-react';
import { useSmartPlaceholder } from '@/hooks/useSmartPlaceholder';
import { Badge } from '@/components/ui/badge';
import { usePromptStore } from '@/store/promptStore';

interface SimpleGeneratorInputPanelProps {
  intent: string;
  context: string;
  isGenerating: boolean;
  onIntentChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onGenerate: () => void;
  onClearTemplate?: () => void;
}

export function SimpleGeneratorInputPanel({
  intent,
  context,
  isGenerating,
  onIntentChange,
  onContextChange,
  onGenerate,
  onClearTemplate
}: SimpleGeneratorInputPanelProps) {
  const intentPlaceholder = useSmartPlaceholder('intermediate', 'intent');
  const contextPlaceholder = useSmartPlaceholder('intermediate', 'context');
  const { currentPrompt } = usePromptStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (intent.trim() && !isGenerating) {
      onGenerate();
    }
  };

  return (
    <div className="space-y-4">
      {/* Enhanced Template Reference Display */}
      {currentPrompt && (
        <Card className="border-brand-200 bg-brand-50/50 dark:bg-brand-950/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-brand-700 dark:text-brand-300">
                    Using Template: {currentPrompt.title}
                  </h4>
                  {/* Show better description or fallback */}
                  {currentPrompt.description && currentPrompt.description !== 'AI Generated Prompt' ? (
                    <p className="text-sm text-brand-600 dark:text-brand-400 mt-1">
                      {currentPrompt.description}
                    </p>
                  ) : (
                    <p className="text-sm text-brand-600 dark:text-brand-400 mt-1">
                      Template loaded - original intent has been restored to the form
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {currentPrompt.tags?.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              {onClearTemplate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearTemplate}
                  className="text-brand-600 hover:text-brand-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="w-full">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-primaryText">
                What do you want to create?
              </h2>
              <p className="text-sm text-secondaryText">
                Describe your goal and we'll generate an optimized prompt for you.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-primaryText mb-2 block">
                  Your Goal *
                  {currentPrompt && (
                    <span className="text-xs text-brand-600 ml-2">(Loaded from: {currentPrompt.title})</span>
                  )}
                </label>
                <Textarea
                  placeholder={intentPlaceholder}
                  value={intent}
                  onChange={(e) => onIntentChange(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-secondaryText mt-1">
                  Be specific about what you want to achieve
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-primaryText mb-2 block">
                  Additional Context (Optional)
                  {currentPrompt && context && (
                    <span className="text-xs text-brand-600 ml-2">(Restored from template)</span>
                  )}
                </label>
                <Textarea
                  placeholder={contextPlaceholder}
                  value={context}
                  onChange={(e) => onContextChange(e.target.value)}
                  rows={2}
                  className="resize-none"
                />
                <p className="text-xs text-secondaryText mt-1">
                  Target audience, tone, constraints, or specific requirements
                </p>
              </div>
            </div>

            <Button 
              type="submit"
              disabled={!intent.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 min-h-[48px] text-base font-medium"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating your prompt...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Optimized Prompt
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
