import { useState } from 'react';
import { ApiKeyRequired } from '@/components/ApiKeyRequired';
import { GeneratorPageHeader } from '@/components/generator/GeneratorPageHeader';
import { EnhancedGeneratorLayout } from '@/components/generator/EnhancedGeneratorLayout';
import { GeneratorHistoryDrawer } from '@/components/generator/GeneratorHistoryDrawer';
import { useGeneratorLogic } from '@/hooks/useGeneratorLogic';
import { motion } from 'framer-motion';
import { useCallback } from 'react';

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
    // Use setLastResult from logic if needed
    setLastResult,
  } = useGeneratorLogic();

  // Add start new prompt handler
  const handleStartNewPrompt = useCallback(() => {
    handleIntentChange('');
    handleContextChange('');
    setComplexity('intermediate');
    setLastResult(null);
  }, [handleIntentChange, handleContextChange, setComplexity, setLastResult]);

  if (!apiKey) {
    return <ApiKeyRequired />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 lg:p-6 max-w-full mx-auto"
    >
      <GeneratorPageHeader onHistoryOpen={() => setHistoryOpen(true)} />

      <EnhancedGeneratorLayout
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
        onStartNewPrompt={handleStartNewPrompt} // <-- Pass to layout
      />

      {/* History Drawer */}
      <GeneratorHistoryDrawer
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        onSelectResult={handleSelectHistoryResult}
      />
    </motion.div>
  );
}
