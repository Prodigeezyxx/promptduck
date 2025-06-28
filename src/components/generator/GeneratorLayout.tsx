
import { useIsMobile } from '@/hooks/use-mobile';
import { AIGeneratorInputPanel } from './AIGeneratorInputPanel';
import { AIGeneratorOutputPanel } from './AIGeneratorOutputPanel';
import { HeuristicType, GenerationResult, ModeType } from '@/types';
import { memo, useMemo } from 'react';

const OptimizedInputPanel = memo(AIGeneratorInputPanel);
const OptimizedOutputPanel = memo(AIGeneratorOutputPanel);

interface GeneratorLayoutProps {
  intent: string;
  context: string;
  complexity: 'simple' | 'intermediate' | 'advanced';
  selectedHeuristics: HeuristicType[];
  selectedMode: ModeType;
  isGenerating: boolean;
  lastResult: GenerationResult | null;
  onIntentChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onComplexityChange: (value: 'simple' | 'intermediate' | 'advanced') => void;
  onModeChange: (mode: ModeType) => void;
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
  selectedMode,
  isGenerating,
  lastResult,
  onIntentChange,
  onContextChange,
  onComplexityChange,
  onModeChange,
  onGenerate,
  onCopyPrompt,
  onSavePrompt,
  onRemixSuggestion,
}: GeneratorLayoutProps) {
  const isMobile = useIsMobile();
  
  // Memoize props objects to prevent unnecessary re-renders
  const inputPanelProps = useMemo(() => ({
    intent,
    context,
    complexity,
    selectedHeuristics,
    selectedMode,
    isGenerating,
    onIntentChange,
    onContextChange,
    onComplexityChange,
    onModeChange,
    onGenerate,
  }), [intent, context, complexity, selectedHeuristics, selectedMode, isGenerating, onIntentChange, onContextChange, onComplexityChange, onModeChange, onGenerate]);

  const outputPanelProps = useMemo(() => ({
    isGenerating,
    lastResult,
    onCopyPrompt,
    onSavePrompt,
    onRemixSuggestion,
  }), [isGenerating, lastResult, onCopyPrompt, onSavePrompt, onRemixSuggestion]);

  if (isMobile) {
    return (
      <div className="space-y-4 sm:space-y-6 pb-4 sm:pb-6">
        <OptimizedInputPanel {...inputPanelProps} />
        <OptimizedOutputPanel {...outputPanelProps} />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:gap-8 max-w-7xl mx-auto min-h-0 lg:grid-cols-12">
      {/* Left Column - Input Panel */}
      <div className="lg:col-span-4 min-h-0">
        <div className="sticky top-6">
          <OptimizedInputPanel {...inputPanelProps} />
        </div>
      </div>

      {/* Right Column - Output Panel */}
      <div className="lg:col-span-8 min-h-0 overflow-hidden">
        <OptimizedOutputPanel {...outputPanelProps} />
      </div>
    </div>
  );
}
