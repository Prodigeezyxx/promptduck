
import { useState } from 'react';
import { ApiKeyRequired } from '@/components/ApiKeyRequired';
import { GeneratorPageHeader } from '@/components/generator/GeneratorPageHeader';
import { StreamlinedGeneratorLayout } from '@/components/generator/StreamlinedGeneratorLayout';
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
    isGenerating,
    lastResult,
    apiKey,
    // Handlers
    handleIntentChange,
    handleContextChange,
    handleGenerate,
    handleSavePrompt,
    handleCopyPrompt,
    handleRemixSuggestion,
    handleSelectHistoryResult,
    setLastResult,
  } = useGeneratorLogic();

  const handleStartNewPrompt = useCallback(() => {
    handleIntentChange('');
    handleContextChange('');
    setLastResult(null);
  }, [handleIntentChange, handleContextChange, setLastResult]);

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

      <StreamlinedGeneratorLayout
        intent={intent}
        context={context}
        isGenerating={isGenerating}
        lastResult={lastResult}
        onIntentChange={handleIntentChange}
        onContextChange={handleContextChange}
        onGenerate={handleGenerate}
        onCopyPrompt={handleCopyPrompt}
        onSavePrompt={handleSavePrompt}
        onRemixSuggestion={handleRemixSuggestion}
        onStartNewPrompt={handleStartNewPrompt}
      />

      <GeneratorHistoryDrawer
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        onSelectResult={handleSelectHistoryResult}
      />
    </motion.div>
  );
}
