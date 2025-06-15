
import { useIsMobile } from '@/hooks/use-mobile';
import { EnhancedAIGeneratorInputPanel } from './EnhancedAIGeneratorInputPanel';
import { EnhancedAIGeneratorOutputPanel } from './EnhancedAIGeneratorOutputPanel';
import { HeuristicType, GenerationResult } from '@/types';
import { memo, useMemo } from 'react';

const OptimizedInputPanel = memo(EnhancedAIGeneratorInputPanel);
const OptimizedOutputPanel = memo(EnhancedAIGeneratorOutputPanel);

interface EnhancedGeneratorLayoutProps {
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

export function EnhancedGeneratorLayout({
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
}: EnhancedGeneratorLayoutProps) {
  const isMobile = useIsMobile();
  
  // Memoize props objects to prevent unnecessary re-renders
  const inputPanelProps = useMemo(() => ({
    intent,
    context,
    complexity,
    selectedHeuristics,
    isGenerating,
    onIntentChange,
    onContextChange,
    onComplexityChange,
    onGenerate,
  }), [intent, context, complexity, selectedHeuristics, isGenerating, onIntentChange, onContextChange, onComplexityChange, onGenerate]);

  const outputPanelProps = useMemo(() => ({
    lastResult,
    isGenerating,
    onCopyPrompt,
    onSavePrompt,
    onRemixSuggestion,
  }), [lastResult, isGenerating, onCopyPrompt, onSavePrompt, onRemixSuggestion]);

  if (isMobile) {
    return (
      <div className="space-y-6 pb-6">
        <OptimizedInputPanel {...inputPanelProps} />
        <OptimizedOutputPanel {...outputPanelProps} />
      </div>
    );
  }

  return (
    <div className="grid gap-8 max-w-7xl mx-auto min-h-0 lg:grid-cols-12">
      {/* Left Column - Input Panel */}
      <div className="lg:col-span-5 min-h-0">
        <div className="sticky top-6">
          <OptimizedInputPanel {...inputPanelProps} />
        </div>
      </div>

      {/* Right Column - Output Panel */}
      <div className="lg:col-span-7 min-h-0 overflow-hidden">
        <OptimizedOutputPanel {...outputPanelProps} />
      </div>
    </div>
  );
}
