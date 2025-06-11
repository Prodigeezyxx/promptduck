
import { useIsMobile } from '@/hooks/use-mobile';
import { useUiStore } from '@/store/uiStore';
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
  const { leftPaneVisible } = useUiStore();

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
    <div className={`grid gap-6 lg:gap-8 max-w-7xl mx-auto min-h-0 transition-all duration-300 ${
      leftPaneVisible ? 'lg:grid-cols-12' : 'lg:grid-cols-1'
    }`}>
      {/* Left Column - Input Panel (Conditionally rendered) */}
      {leftPaneVisible && (
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
      )}

      {/* Right Column - Output Panel (Expandable) */}
      <div className={`min-h-0 overflow-hidden ${
        leftPaneVisible ? 'lg:col-span-8' : 'lg:col-span-12'
      }`}>
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
