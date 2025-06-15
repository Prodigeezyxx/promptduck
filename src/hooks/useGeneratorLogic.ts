
import { useState, useEffect } from 'react';
import { useGeneratorStore } from '@/store/generatorStore';
import { useCreditStore } from '@/store/creditStore';
import { useApiKeyStore } from '@/store/apiKeyStore';
import { usePromptStore } from '@/store/promptStore';
import { useSupabasePrompts } from './useSupabasePrompts';
import { useSupabaseGenerations } from './useSupabaseGenerations';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { openaiService } from '@/services/openaiService';
import { IntentDetectionEngine } from '@/services/intent/intentDetection';
import { selectHeuristics } from '@/utils/heuristicSelector';
import { GenerationRequest, GenerationResult } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useGeneratorLogic() {
  const { user } = useAuthContext();
  const { isGenerating, lastResult, history, setGenerating, setLastResult, setHistory } = useGeneratorStore();
  const { useCredit, canUseCredit, getRemainingCredits } = useCreditStore();
  const { apiKey } = useApiKeyStore();
  const { addPrompt, currentPrompt, setCurrentPrompt, setPrompts } = usePromptStore();
  
  // Supabase hooks
  const { prompts: supabasePrompts, savePrompt: saveToSupabase } = useSupabasePrompts();
  const { generations, saveGeneration, setHistory: setSupabaseHistory } = useSupabaseGenerations();

  const [intent, setIntent] = useState('');
  const [context, setContext] = useState('');
  
  // Use smart defaults - always intermediate complexity
  const complexity = 'intermediate' as const;

  // Sync Supabase data to local stores when user is authenticated
  useEffect(() => {
    if (user && supabasePrompts.length > 0) {
      setPrompts(supabasePrompts);
    }
  }, [user, supabasePrompts, setPrompts]);

  useEffect(() => {
    if (user && generations.length > 0) {
      setSupabaseHistory(generations);
    }
  }, [user, generations, setSupabaseHistory]);

  // Clear template reference when used
  useEffect(() => {
    if (currentPrompt) {
      console.log('Template selected:', currentPrompt.title);
      setCurrentPrompt(null);
    }
  }, [currentPrompt, setCurrentPrompt]);

  const handleIntentChange = (value: string) => {
    setIntent(value);
  };

  const handleContextChange = (value: string) => {
    setContext(value);
  };

  const handleGenerate = async () => {
    if (!intent.trim()) {
      toast({ title: 'Error', description: 'Please describe your intent' });
      return;
    }

    if (!canUseCredit()) {
      toast({ 
        title: 'Daily limit reached', 
        description: `You've used all ${getRemainingCredits()} credits today. They reset daily.` 
      });
      return;
    }

    if (!useCredit()) {
      toast({ title: 'Error', description: 'Unable to use credit' });
      return;
    }

    setGenerating(true);
    
    try {
      // Get intelligent heuristics based on intent and context
      const heuristicsToUse = selectHeuristics(intent, context);

      // Initialize service with the OpenAI API key
      if (apiKey?.openai) {
        openaiService.initialize(apiKey.openai);
      }

      const contextValue = context?.trim();
      
      const request: GenerationRequest = {
        intent: intent.trim(),
        heuristics: heuristicsToUse,
        context: contextValue || undefined,
        complexity
      };

      console.log('Generation request object:', JSON.stringify(request, null, 2));

      const result = await openaiService.generatePrompt(request);
      console.log('Generation result received:', result);
      
      setLastResult(result);
      
      // Save to Supabase if user is authenticated
      if (user) {
        await saveGeneration(result, intent.trim(), contextValue);
      }
      
      toast({ 
        title: 'Prompt generated!', 
        description: `Applied ${heuristicsToUse.length} cognitive heuristics` 
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({ 
        title: 'Generation failed', 
        description: 'Please try again in a moment.' 
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleSavePrompt = async () => {
    if (!lastResult) return;

    const promptData = {
      title: lastResult.preview_title,
      content: lastResult.optimized_prompt,
      description: 'AI Generated Prompt',
      tags: lastResult.tags,
      persona: 'strategist' as const,
      heuristics: lastResult.heuristics,
      variables: lastResult.variables,
      category: 'general' as const,
      difficulty: 'intermediate' as const,
      estimatedTime: '15 minutes'
    };

    if (user) {
      // Save to Supabase for authenticated users
      const saved = await saveToSupabase(promptData);
      if (saved) {
        toast({ title: 'Saved!', description: 'Prompt added to your cloud library.' });
      }
    } else {
      // Save to localStorage for unauthenticated users
      addPrompt(promptData);
      toast({ title: 'Saved!', description: 'Prompt added to your local library.' });
    }
  };

  const handleCopyPrompt = () => {
    if (!lastResult) return;
    
    navigator.clipboard.writeText(lastResult.optimized_prompt);
    toast({ title: 'Copied!', description: 'Prompt copied to clipboard.' });
  };

  const handleRemixSuggestion = (suggestion: string) => {
    const newContext = context ? `${context}. ${suggestion}` : suggestion;
    setContext(newContext);
    
    toast({ 
      title: 'Remix applied!', 
      description: 'Suggestion added to context. Click generate to create a new version.' 
    });
  };

  const handleSelectHistoryResult = (result: GenerationResult) => {
    setLastResult(result);
    toast({ title: 'Loaded!', description: 'Historical result loaded.' });
  };

  return {
    // State
    intent,
    context,
    complexity,
    isGenerating,
    lastResult,
    history: user ? generations : history,
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
  };
}
