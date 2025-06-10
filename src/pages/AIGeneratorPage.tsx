
import { useState } from 'react';
import { ApiKeyRequired } from '@/components/ApiKeyRequired';
import { GeneratorPageHeader } from '@/components/generator/GeneratorPageHeader';
import { GeneratorLayout } from '@/components/generator/GeneratorLayout';
import { GeneratorHistoryDrawer } from '@/components/generator/GeneratorHistoryDrawer';
import { useGeneratorLogic } from '@/hooks/useGeneratorLogic';

export default function AIGeneratorPage() {
  const [historyOpen, setHistoryOpen] = useState(false);
  
  const {
    // State
    intent,
    context,
    complexity,
    selectedHeuristics,
    isGenerating,
    lastResult,
    apiKey,
    // Handlers
    handleIntentChange,
    handleContextChange,
    setComplexity,
    handleGenerate,
    handleSavePrompt,
    handleCopyPrompt,
    handleRemixSuggestion,
    handleSelectHistoryResult,
  } = useGeneratorLogic();

  if (!apiKey) {
    return <ApiKeyRequired />;
  }

  return (
    <div className="p-4 lg:p-6 max-w-full mx-auto">
      <GeneratorPageHeader onHistoryOpen={() => setHistoryOpen(true)} />

      <GeneratorLayout
        intent={intent}
        context={context}
        complexity={complexity}
        selectedHeuristics={selectedHeuristics}
        isGenerating={isGenerating}
        lastResult={lastResult}
        onIntentChange={handleIntentChange}
        onContextChange={handleContextChange}
        onComplexityChange={setComplexity}
        onGenerate={handleGenerate}
        onCopyPrompt={handleCopyPrompt}
        onSavePrompt={handleSavePrompt}
        onRemixSuggestion={handleRemixSuggestion}
      />

      {/* History Drawer */}
      <GeneratorHistoryDrawer
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        onSelectResult={handleSelectHistoryResult}
      />
    </div>
  );
}
