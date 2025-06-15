
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useSmartPlaceholder } from '@/hooks/useSmartPlaceholder';

interface SimpleGeneratorInputPanelProps {
  intent: string;
  context: string;
  isGenerating: boolean;
  onIntentChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onGenerate: () => void;
}

export function SimpleGeneratorInputPanel({
  intent,
  context,
  isGenerating,
  onIntentChange,
  onContextChange,
  onGenerate
}: SimpleGeneratorInputPanelProps) {
  const intentPlaceholder = useSmartPlaceholder('intermediate', 'intent');
  const contextPlaceholder = useSmartPlaceholder('intermediate', 'context');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (intent.trim() && !isGenerating) {
      onGenerate();
    }
  };

  return (
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
  );
}
