import { useState } from 'react';
import { useGeneratorStore } from '@/store/generatorStore';
import { useApiKeyStore } from '@/store/apiKeyStore';
import { ModeType } from '@/types';
import { DEFAULT_MODE } from '@/constants/modes';
import { toast } from '@/hooks/use-toast';
import { useTemplateLoader } from './useTemplateLoader';
import { useSupabaseSync } from './useSupabaseSync';
import { useGenerationHandlers } from './useGenerationHandlers';
import { useTemplateExtractor } from './useTemplateExtractor';

export function useGeneratorLogic() {
  const { isGenerating, lastResult, history } = useGeneratorStore();
  const { apiKey } = useApiKeyStore();

  const [intent, setIntent] = useState('');
  const [context, setContext] = useState('');
  const [selectedMode, setSelectedMode] = useState<ModeType>(DEFAULT_MODE);
  
  // Use smart defaults - always intermediate complexity
  const complexity = 'intermediate' as const;

  // Use the refactored hooks
  const { user } = useSupabaseSync();
  useTemplateLoader(); // Handles template loading side effects
  const { currentPrompt, extractTemplateData } = useTemplateExtractor();
  const {
    handleGenerate: baseHandleGenerate,
    handleSavePrompt: baseHandleSavePrompt,
    handleCopyPrompt,
    handleRemixSuggestion: baseHandleRemixSuggestion,
    handleSelectHistoryResult,
    handleClearTemplate: baseHandleClearTemplate,
    handleStartNewPrompt: baseHandleStartNewPrompt,
  } = useGenerationHandlers();

  // Set intent and context when template is loaded
  if (currentPrompt && !intent && !context) {
    const { originalIntent, originalContext } = extractTemplateData();
    setIntent(originalIntent || '');
    setContext(originalContext || '');
  }

  const handleIntentChange = (value: string) => {
    setIntent(value);
  };

  const handleContextChange = (value: string) => {
    setContext(value);
  };

  const handleModeChange = (mode: ModeType) => {
    setSelectedMode(mode);
    toast({ 
      title: 'Mode changed', 
      description: `Switched to ${mode} mode for optimized prompt generation.` 
    });
  };

  // Wrapper functions that pass the necessary state
  const handleGenerate = async (isAutoGeneration = false) => {
    await baseHandleGenerate(intent, context, selectedMode, isAutoGeneration);
  };

  const handleSavePrompt = async () => {
    await baseHandleSavePrompt(intent, context);
  };

  const handleRemixSuggestion = (suggestion: string) => {
    baseHandleRemixSuggestion(suggestion, context, setContext);
  };

  const handleClearTemplate = () => {
    baseHandleClearTemplate(setIntent, setContext);
  };

  const handleStartNewPrompt = () => {
    baseHandleStartNewPrompt(setIntent, setContext, setSelectedMode);
  };

  return {
    // State
    intent,
    context,
    complexity,
    selectedMode,
    isGenerating,
    lastResult,
    history: user ? [] : history, // Simplified since generations is handled in useSupabaseSync
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
  };
}
