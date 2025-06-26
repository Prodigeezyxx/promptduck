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
  const { isGenerating, lastResult, history, setGenerating, setLastResult, setHistory: setLocalHistory } = useGeneratorStore();
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

  // Enhanced template loading logic to handle existing prompts better
  useEffect(() => {
    if (currentPrompt) {
      console.log('Loading template into generator:', currentPrompt.title);
      
      // Smart intent extraction based on available data
      let originalIntent = '';
      let originalContext = '';

      // Try to get meaningful intent from description first
      if (currentPrompt.description && 
          currentPrompt.description !== 'AI Generated Prompt' && 
          currentPrompt.description.trim() !== '') {
        originalIntent = currentPrompt.description;
      } else {
        // Fallback: extract intent from title or content
        originalIntent = currentPrompt.title;
        
        // If title is also generic, try to extract from content
        if (currentPrompt.title.includes('AI Generated') || currentPrompt.title.includes('Copy')) {
          const contentLines = currentPrompt.content.split('\n').filter(line => line.trim());
          const meaningfulLine = contentLines.find(line => 
            !line.startsWith('#') && 
            !line.includes('Context:') && 
            !line.includes('Role:') &&
            line.length > 20
          );
          if (meaningfulLine) {
            originalIntent = meaningfulLine.slice(0, 100);
          }
        }
      }

      // Try to extract context from variables
      const contextVariable = currentPrompt.variables?.find(v => 
        v.name === 'original_context' || 
        v.name.includes('context') ||
        v.description?.length > 10
      );
      
      if (contextVariable?.description) {
        originalContext = contextVariable.description;
      }
      
      setIntent(originalIntent || '');
      setContext(originalContext || '');
      
      toast({ 
        title: 'Template loaded!', 
        description: `"${currentPrompt.title}" has been loaded into the generator.` 
      });
    }
  }, [currentPrompt]);

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

      // Initialize service - no API key needed since it's server-side
      openaiService.initialize();

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

    // Create a meaningful title from the preview title or intent
    const promptTitle = lastResult.preview_title || intent.slice(0, 60) + (intent.length > 60 ? '...' : '');
    
    const promptData = {
      title: promptTitle,
      content: lastResult.optimized_prompt || lastResult.result, // Use optimized_prompt if available, fallback to result
      description: intent, // Store the original user intent as description (FIXED)
      tags: lastResult.tags || [],
      persona: 'strategist' as const,
      heuristics: lastResult.heuristics || [],
      variables: [
        // Store the original context as a variable for reference
        ...(context ? [{
          name: 'original_context',
          type: 'text' as const,
          required: false,
          description: context
        }] : []),
        ...(lastResult.variables || [])
      ],
      category: 'general' as const,
      difficulty: 'intermediate' as const,
      estimatedTime: '15 minutes'
    };

    if (user) {
      // Save to Supabase for authenticated users
      const saved = await saveToSupabase(promptData);
      if (saved) {
        toast({ 
          title: 'Saved!', 
          description: 'Prompt added to your cloud library with original intent preserved.' 
        });
      }
    } else {
      // Save to localStorage for unauthenticated users
      addPrompt(promptData);
      toast({ 
        title: 'Saved!', 
        description: 'Prompt added to your local library with original intent preserved.' 
      });
    }
  };

  const handleCopyPrompt = () => {
    if (!lastResult) return;
    
    navigator.clipboard.writeText(lastResult.optimized_prompt || lastResult.result);
    toast({ title: 'Copied!', description: 'Refined prompt copied to clipboard.' });
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

  const handleClearTemplate = () => {
    setCurrentPrompt(null);
    setIntent('');
    setContext('');
  };

  const handleStartNewPrompt = () => {
    setIntent('');
    setContext('');
    setCurrentPrompt(null);
    setLastResult(null);
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
    handleClearTemplate,
    handleStartNewPrompt,
    setLastResult,
  };
}
