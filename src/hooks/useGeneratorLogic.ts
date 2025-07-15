import { useState, useEffect } from 'react';
import { useGeneratorStore } from '@/store/generatorStore';
import { useApiKeyStore } from '@/store/apiKeyStore';
import { ModeType } from '@/types';
import { DEFAULT_MODE } from '@/constants/modes';
import { toast } from '@/hooks/use-toast';
import { useTemplateLoader } from './useTemplateLoader';
import { useSupabaseSync } from './useSupabaseSync';
import { useGenerationHandlers } from './useGenerationHandlers';
import { useTemplateExtractor } from './useTemplateExtractor';
import { useAuth } from './useAuth';
import { promptPersistence } from '@/utils/promptPersistence';

export function useGeneratorLogic() {
  const { isGenerating, lastResult, history } = useGeneratorStore();
  const { apiKey } = useApiKeyStore();

  const [intent, setIntent] = useState('');
  const [context, setContext] = useState('');
  const [selectedMode, setSelectedMode] = useState<ModeType>(DEFAULT_MODE);
  const [hasLoadedStoredPrompt, setHasLoadedStoredPrompt] = useState(false);
  
  // Use smart defaults - always intermediate complexity
  const complexity = 'intermediate' as const;

  // Use the refactored hooks
  const { user } = useSupabaseSync();
  const { isLoaded: authLoaded } = useAuth();
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

  // Check for stored prompt from landing page - runs on mount and when auth loads
  useEffect(() => {
    // Don't check if we've already loaded a stored prompt
    if (hasLoadedStoredPrompt) return;
    
    // Wait for auth to be loaded to avoid race conditions
    if (!authLoaded) return;
    
    const storedPrompt = promptPersistence.getStoredPrompt();
    console.log('Checking for stored prompt:', { 
      storedPrompt: storedPrompt?.prompt, 
      currentIntent: intent, 
      currentContext: context,
      authLoaded 
    });
    
    if (storedPrompt && storedPrompt.prompt) {
      console.log('Loading stored prompt from landing page:', storedPrompt.prompt);
      
      // Always load the stored prompt, even if intent/context exist
      setIntent(storedPrompt.prompt);
      setHasLoadedStoredPrompt(true);
      
      // Clear the stored prompt after loading
      promptPersistence.clearPrompt();
      
      // Show toast to let user know their prompt was loaded
      toast({
        title: 'Prompt Loaded',
        description: 'Your prompt from the landing page has been loaded.',
      });
    }
  }, [authLoaded, hasLoadedStoredPrompt]);

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
