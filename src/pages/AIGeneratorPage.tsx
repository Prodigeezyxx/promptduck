
import { useState } from 'react';
import { ApiKeyRequired } from '@/components/ApiKeyRequired';
import { GeneratorPageHeader } from '@/components/generator/GeneratorPageHeader';
import { StreamlinedGeneratorLayout } from '@/components/generator/StreamlinedGeneratorLayout';
import { GeneratorHistoryDrawer } from '@/components/generator/GeneratorHistoryDrawer';
import { useGeneratorLogic } from '@/hooks/useGeneratorLogic';
import { useAnalytics } from '@/hooks/useAnalytics';
import { motion } from 'framer-motion';

export default function AIGeneratorPage() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const { track } = useAnalytics();
  
  const {
    // State
    intent,
    context,
    isGenerating,
    lastResult,
    apiKey,
    templateReference,
    // Handlers
    handleIntentChange,
    handleContextChange,
    handleGenerate,
    handleSavePrompt,
    handleCopyPrompt,
    handleRemixSuggestion,
    handleSelectHistoryResult,
    handleClearTemplate,
    handleStartNewPrompt,
  } = useGeneratorLogic();

  // Enhanced handlers with analytics
  const handleGenerateWithAnalytics = async () => {
    track('prompt_generation_started', {
      intent_length: intent.length,
      context_length: context.length,
      has_template: !!templateReference,
    });
    
    try {
      await handleGenerate();
      track('prompt_generation_completed', {
        success: true,
      });
    } catch (error) {
      track('prompt_generation_completed', {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleSavePromptWithAnalytics = () => {
    track('prompt_saved', {
      prompt_length: lastResult?.optimized_prompt?.length || 0,
      heuristics_count: lastResult?.heuristics?.length || 0,
    });
    handleSavePrompt();
  };

  const handleCopyPromptWithAnalytics = () => {
    track('prompt_copied', {
      prompt_length: lastResult?.optimized_prompt?.length || 0,
    });
    handleCopyPrompt();
  };

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
        templateReference={templateReference}
        onIntentChange={handleIntentChange}
        onContextChange={handleContextChange}
        onGenerate={handleGenerateWithAnalytics}
        onCopyPrompt={handleCopyPromptWithAnalytics}
        onSavePrompt={handleSavePromptWithAnalytics}
        onRemixSuggestion={handleRemixSuggestion}
        onStartNewPrompt={handleStartNewPrompt}
        onClearTemplate={handleClearTemplate}
      />

      <GeneratorHistoryDrawer
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        onSelectResult={handleSelectHistoryResult}
      />
    </motion.div>
  );
}
