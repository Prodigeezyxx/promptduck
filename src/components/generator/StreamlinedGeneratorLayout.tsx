
import { AIGeneratorInputPanel } from './AIGeneratorInputPanel';
import { AIGeneratorOutputPanel } from './AIGeneratorOutputPanel';
import { GenerationResult, HeuristicType, ModeType } from '@/types';
import { selectHeuristics } from '@/utils/heuristicSelector';

interface StreamlinedGeneratorLayoutProps {
  intent: string;
  context: string;
  selectedMode: ModeType;
  isGenerating: boolean;
  lastResult: GenerationResult | null;
  onIntentChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onModeChange: (mode: ModeType) => void;
  onGenerate: () => void;
  onCopyPrompt: () => void;
  onSavePrompt: () => void;
  onRemixSuggestion: (suggestion: string) => void;
  onStartNewPrompt: () => void;
  onClearTemplate: () => void;
}

export function StreamlinedGeneratorLayout({
  intent,
  context,
  selectedMode,
  isGenerating,
  lastResult,
  onIntentChange,
  onContextChange,
  onModeChange,
  onGenerate,
  onCopyPrompt,
  onSavePrompt,
  onRemixSuggestion,
  onStartNewPrompt,
  onClearTemplate
}: StreamlinedGeneratorLayoutProps) {
  // Get selected heuristics for display
  const selectedHeuristics = selectHeuristics(intent, context) as HeuristicType[];
  const complexity = 'intermediate' as const;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
      {/* Input Panel */}
      <div className="order-1">
        <AIGeneratorInputPanel
          intent={intent}
          context={context}
          complexity={complexity}
          selectedHeuristics={selectedHeuristics}
          selectedMode={selectedMode}
          isGenerating={isGenerating}
          onIntentChange={onIntentChange}
          onContextChange={onContextChange}
          onComplexityChange={() => {}} // Not used in streamlined version
          onModeChange={onModeChange}
          onGenerate={onGenerate}
        />
      </div>

      {/* Output Panel */}
      <div className="order-2">
        <AIGeneratorOutputPanel
          isGenerating={isGenerating}
          lastResult={lastResult}
          onCopyPrompt={onCopyPrompt}
          onSavePrompt={onSavePrompt}
          onRemixSuggestion={onRemixSuggestion}
          onClearTemplate={onClearTemplate}
        />
      </div>
    </div>
  );
}
