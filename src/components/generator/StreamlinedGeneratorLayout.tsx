
import { AIGeneratorInputPanel } from './AIGeneratorInputPanel';
import { EnhancedAIGeneratorOutputPanel } from './EnhancedAIGeneratorOutputPanel';
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
  originalIntent?: string;
  originalContext?: string;
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
  onClearTemplate,
  originalIntent,
  originalContext
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
        <EnhancedAIGeneratorOutputPanel
          isGenerating={isGenerating}
          lastResult={lastResult}
          selectedMode={selectedMode}
          originalIntent={originalIntent || intent}
          originalContext={originalContext || context}
          onCopyPrompt={onCopyPrompt}
          onSavePrompt={onSavePrompt}
          onRemixSuggestion={onRemixSuggestion}
          onStartNewPrompt={onStartNewPrompt}
        />
      </div>
    </div>
  );
}
