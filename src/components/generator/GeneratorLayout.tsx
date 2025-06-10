
import { useIsMobile } from '@/hooks/use-mobile';
import { AIGeneratorInputPanel } from './AIGeneratorInputPanel';
import { AIGeneratorOutputPanel } from './AIGeneratorOutputPanel';
import { HeuristicType, GenerationResult } from '@/types';

interface GeneratorLayoutProps {
  intent: string;
  context: string;
  complexity: 'simple' | 'intermediate' | 'advanced';
  selectedHeuristics: HeuristicType[];
  isGenerating: boolean;
  lastResult: GenerationResult | null;
  onIntentChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onComplexityChange: (value: 'simple' | 'intermediate' | 'advanced') => void;
  onGenerate: () => void;
  onCopyPrompt: () => void;
  onSavePrompt: () => void;
  onRemixSuggestion: (suggestion: string) => void;
}

export function GeneratorLayout({
  intent,
  context,
  complexity,
  selectedHeuristics,
  isGenerating,
  lastResult,
  onIntentChange,
  onContextChange,
  onComplexityChange,
  onGenerate,
  onCopyPrompt,
  onSavePrompt,
  onRemixSuggestion,
}: GeneratorLayoutProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-6 pb-6">
        <AIGeneratorInputPanel
          intent={intent}
          context={context}
          complexity={complexity}
          selectedHeuristics={selectedHeuristics}
          isGenerating={isGenerating}
          onIntentChange={onIntentChange}
          onContextChange={onContextChange}
          onComplexityChange={onComplexityChange}
          onGenerate={onGenerate}
        />

        <AIGeneratorOutputPanel
          lastResult={lastResult}
          onCopyPrompt={onCopyPrompt}
          onSavePrompt={onSavePrompt}
          onRemixSuggestion={onRemixSuggestion}
        />
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 max-w-7xl mx-auto min-h-0">
      {/* Left Column - Input Panel (Fixed width) */}
      <div className="lg:col-span-4 min-h-0">
        <div className="sticky top-6">
          <AIGeneratorInputPanel
            intent={intent}
            context={context}
            complexity={complexity}
            selectedHeuristics={selectedHeuristics}
            isGenerating={isGenerating}
            onIntentChange={onIntentChange}
            onContextChange={onContextChange}
            onComplexityChange={onComplexityChange}
            onGenerate={onGenerate}
          />
        </div>
      </div>

      {/* Right Column - Output Panel (Expandable) */}
      <div className="lg:col-span-8 min-h-0 overflow-hidden">
        <AIGeneratorOutputPanel
          lastResult={lastResult}
          onCopyPrompt={onCopyPrompt}
          onSavePrompt={onSavePrompt}
          onRemixSuggestion={onRemixSuggestion}
        />
      </div>
    </div>
  );
}
