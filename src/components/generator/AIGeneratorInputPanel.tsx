
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Sparkles } from 'lucide-react';
import { HeuristicType } from '@/types';
import { HeuristicsDisplay } from './HeuristicsDisplay';
import { TemplateReference } from './TemplateReference';
import { usePromptStore } from '@/store/promptStore';
import { memo, useState } from 'react';

const OptimizedHeuristicsDisplay = memo(HeuristicsDisplay);

interface AIGeneratorInputPanelProps {
  intent: string;
  context: string;
  complexity: 'simple' | 'intermediate' | 'advanced';
  selectedHeuristics: HeuristicType[];
  isGenerating: boolean;
  onIntentChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onComplexityChange: (value: 'simple' | 'intermediate' | 'advanced') => void;
  onGenerate: () => void;
}

export function AIGeneratorInputPanel({
  intent,
  context,
  complexity,
  selectedHeuristics,
  isGenerating,
  onIntentChange,
  onContextChange,
  onComplexityChange,
  onGenerate
}: AIGeneratorInputPanelProps) {
  const { currentPrompt, setCurrentPrompt } = usePromptStore();
  const [showTemplateReference, setShowTemplateReference] = useState(false);

  // Show template reference when a template is selected
  const handleTemplateUseAsStartingPoint = () => {
    if (currentPrompt) {
      // Use template as starting point - pre-fill with guidance
      onIntentChange(`Create a prompt similar to: ${currentPrompt.title}`);
      onContextChange(`Reference template: ${currentPrompt.description}\n\nTemplate structure: ${currentPrompt.content}`);
      setShowTemplateReference(false);
      setCurrentPrompt(null);
    }
  };

  const handleCloseTemplateReference = () => {
    setShowTemplateReference(false);
    setCurrentPrompt(null);
  };

  // Show template reference when currentPrompt is set
  if (currentPrompt && !showTemplateReference) {
    setShowTemplateReference(true);
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Template Reference Panel */}
      {showTemplateReference && currentPrompt && (
        <TemplateReference
          template={currentPrompt}
          onClose={handleCloseTemplateReference}
          onUseAsStartingPoint={handleTemplateUseAsStartingPoint}
        />
      )}

      <Card>
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Intent & Context</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">What do you want to achieve?</label>
            <Textarea
              placeholder="Describe your goal or what you want the prompt to help with..."
              value={intent}
              onChange={(e) => onIntentChange(e.target.value)}
              rows={6}
              className="resize-none text-base"
            />
          </div>

          {/* Generate Button - Prominently placed after intent with better mobile sizing */}
          <Button 
            onClick={onGenerate} 
            disabled={isGenerating || !intent.trim()}
            className="w-full bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 min-h-[48px] text-base font-medium"
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
          
          <div>
            <label className="text-sm font-medium mb-2 block">Additional Context (Optional)</label>
            <Textarea
              placeholder="Any specific requirements, constraints, or background information..."
              value={context}
              onChange={(e) => onContextChange(e.target.value)}
              rows={2}
              className="resize-none text-base"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Complexity</label>
            <Select value={complexity} onValueChange={onComplexityChange}>
              <SelectTrigger className="min-h-[44px] text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple" className="text-base">Simple</SelectItem>
                <SelectItem value="intermediate" className="text-base">Intermediate</SelectItem>
                <SelectItem value="advanced" className="text-base">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedHeuristics.length > 0 && (
        <OptimizedHeuristicsDisplay selectedHeuristics={selectedHeuristics} />
      )}
    </div>
  );
}
