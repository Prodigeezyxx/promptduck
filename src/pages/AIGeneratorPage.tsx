
import { useState } from 'react';
import { ApiKeyRequired } from '@/components/ApiKeyRequired';
import { GeneratorPageHeader } from '@/components/generator/GeneratorPageHeader';
import { TabbedGeneratorLayout } from '@/components/generator/TabbedGeneratorLayout';
import { FloatingCreditCounter } from '@/components/generator/FloatingCreditCounter';
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
    selectedMode,
    isGenerating,
    lastResult,
    history,
    apiKey,
    // Handlers
    handleIntentChange,
    handleContextChange,
    handleModeChange,
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
      mode: selectedMode,
    });
    
    try {
      await handleGenerate();
      track('prompt_generation_completed', {
        success: true,
        mode: selectedMode,
      });
    } catch (error) {
      track('prompt_generation_completed', {
        success: false,
        mode: selectedMode,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleSavePromptWithAnalytics = () => {
    track('prompt_saved', {
      prompt_length: lastResult?.optimized_prompt?.length || 0,
      heuristics_count: lastResult?.heuristics?.length || 0,
      mode: selectedMode,
    });
    handleSavePrompt();
  };

  const handleCopyPromptWithAnalytics = () => {
    track('prompt_copied', {
      prompt_length: lastResult?.optimized_prompt?.length || 0,
      mode: selectedMode,
    });
    handleCopyPrompt();
  };

  if (!apiKey) {
    return <ApiKeyRequired />;
  }

  return (
    <div className="min-h-screen bg-background">
      <FloatingCreditCounter />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 lg:p-6"
      >
        <GeneratorPageHeader onHistoryOpen={() => setHistoryOpen(true)} />

        <div className="mt-6">
          <TabbedGeneratorLayout
            intent={intent}
            context={context}
            selectedMode={selectedMode}
            isGenerating={isGenerating}
            lastResult={lastResult}
            history={history}
            onIntentChange={handleIntentChange}
            onContextChange={handleContextChange}
            onModeChange={handleModeChange}
            onGenerate={handleGenerateWithAnalytics}
            onCopyPrompt={handleCopyPromptWithAnalytics}
            onSavePrompt={handleSavePromptWithAnalytics}
            onRemixSuggestion={handleRemixSuggestion}
            onStartNewPrompt={handleStartNewPrompt}
            onSelectHistoryResult={handleSelectHistoryResult}
          />
        </div>

        <GeneratorHistoryDrawer
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          onSelectResult={handleSelectHistoryResult}
        />
      </motion.div>
    </div>
  );
}
