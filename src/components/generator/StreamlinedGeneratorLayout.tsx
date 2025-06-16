
import { useIsMobile } from '@/hooks/use-mobile';
import { SimpleGeneratorInputPanel } from './SimpleGeneratorInputPanel';
import { EnhancedAIGeneratorOutputPanel } from './EnhancedAIGeneratorOutputPanel';
import { HeuristicType, GenerationResult } from '@/types';
import { memo, useMemo } from 'react';

const OptimizedInputPanel = memo(SimpleGeneratorInputPanel);
const OptimizedOutputPanel = memo(EnhancedAIGeneratorOutputPanel);

interface StreamlinedGeneratorLayoutProps {
  intent: string;
  context: string;
  isGenerating: boolean;
  lastResult: GenerationResult | null;
  templateReference?: any;
  onIntentChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onGenerate: () => void;
  onCopyPrompt: () => void;
  onSavePrompt: () => void;
  onRemixSuggestion: (suggestion: string) => void;
  onStartNewPrompt: () => void;
  onClearTemplate?: () => void;
}

export function StreamlinedGeneratorLayout({
  intent,
  context,
  isGenerating,
  lastResult,
  templateReference,
  onIntentChange,
  onContextChange,
  onGenerate,
  onCopyPrompt,
  onSavePrompt,
  onRemixSuggestion,
  onStartNewPrompt,
  onClearTemplate,
}: StreamlinedGeneratorLayoutProps) {
  const isMobile = useIsMobile();
  
  const inputPanelProps = useMemo(() => ({
    intent,
    context,
    isGenerating,
    templateReference,
    onIntentChange,
    onContextChange,
    onGenerate,
    onClearTemplate,
  }), [intent, context, isGenerating, templateReference, onIntentChange, onContextChange, onGenerate, onClearTemplate]);

  const outputPanelProps = useMemo(() => ({
    lastResult,
    isGenerating,
    onCopyPrompt,
    onSavePrompt,
    onRemixSuggestion,
    onStartNewPrompt,
  }), [lastResult, isGenerating, onCopyPrompt, onSavePrompt, onRemixSuggestion, onStartNewPrompt]);

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
