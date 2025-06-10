import { useState, useEffect } from 'react';
import { useGeneratorStore } from '@/store/generatorStore';
import { useCreditStore } from '@/store/creditStore';
import { useApiKeyStore } from '@/store/apiKeyStore';
import { usePromptStore } from '@/store/promptStore';
import { geminiService } from '@/services/geminiService';
import { IntentDetectionEngine } from '@/services/intent/intentDetection';
import { selectHeuristics } from '@/utils/heuristicSelector';
import { HeuristicType, GenerationRequest, GenerationResult } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useGeneratorLogic() {
  const { isGenerating, lastResult, setGenerating, setLastResult } = useGeneratorStore();
  const { useCredit, canUseCredit, getRemainingCredits } = useCreditStore();
  const { apiKey } = useApiKeyStore();
  const { addPrompt, currentPrompt, setCurrentPrompt } = usePromptStore();

  const [intent, setIntent] = useState('');
  const [context, setContext] = useState('');
  const [complexity, setComplexity] = useState<'simple' | 'intermediate' | 'advanced'>('intermediate');
  const [selectedHeuristics, setSelectedHeuristics] = useState<HeuristicType[]>([]);

  // Pre-fill form when currentPrompt is set (from template click)
  useEffect(() => {
    if (currentPrompt) {
      setIntent(currentPrompt.description || currentPrompt.title);
      setContext(currentPrompt.content);
      setSelectedHeuristics(currentPrompt.heuristics);
      setCurrentPrompt(null);
    }
  }, [currentPrompt, setCurrentPrompt]);

  // Enhanced intent change handler with smart heuristic selection
  const handleIntentChange = (value: string) => {
    setIntent(value);
    if (value.trim()) {
      const intentAnalysis = IntentDetectionEngine.analyzeIntent(value, context);
      setSelectedHeuristics(intentAnalysis.suggestedHeuristics);
      
      // Auto-adjust complexity based on intent analysis
      setComplexity(intentAnalysis.complexity);
      
      // Show intent detection feedback
      if (intentAnalysis.confidence > 0.7) {
        console.log(`Detected intent: ${intentAnalysis.primaryIntent} (${Math.round(intentAnalysis.confidence * 100)}% confidence)`);
      }
    }
  };

  const handleContextChange = (value: string) => {
    setContext(value);
    if (intent.trim()) {
      const intentAnalysis = IntentDetectionEngine.analyzeIntent(intent, value);
      setSelectedHeuristics(intentAnalysis.suggestedHeuristics);
      setComplexity(intentAnalysis.complexity);
    }
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
      // Get intelligent heuristics if not already set
      const heuristicsToUse = selectedHeuristics.length > 0 
        ? selectedHeuristics 
        : selectHeuristics(intent, context);

      // Initialize Gemini service with the internal API key
      if (apiKey) {
        geminiService.initialize(apiKey.gemini);
      }

      // Ensure context is properly handled - convert to string or undefined
      const contextValue = context?.trim();
      
      const request: GenerationRequest = {
        intent: intent.trim(),
        heuristics: heuristicsToUse,
        context: contextValue || undefined, // Ensure it's a string or undefined, not an object
        complexity
      };

      console.log('Generation request object:', JSON.stringify(request, null, 2));

      const result = await geminiService.generatePrompt(request);
      console.log('Generation result received:', result);
      
      setLastResult(result);
      
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

  const handleSavePrompt = () => {
    if (!lastResult) return;

    addPrompt({
      title: lastResult.preview_title,
      content: lastResult.optimized_prompt,
      description: 'AI Generated Prompt',
      tags: lastResult.tags,
      persona: 'strategist',
      heuristics: lastResult.heuristics,
      variables: lastResult.variables,
      category: 'general'
    });

    toast({ title: 'Saved!', description: 'Prompt added to your library.' });
  };

  const handleCopyPrompt = () => {
    if (!lastResult) return;
    
    navigator.clipboard.writeText(lastResult.optimized_prompt);
    toast({ title: 'Copied!', description: 'Prompt copied to clipboard.' });
  };

  const handleRemixSuggestion = (suggestion: string) => {
    // Apply the remix suggestion to the current context/intent
    const newContext = context ? `${context}. ${suggestion}` : suggestion;
    setContext(newContext);
    
    // Update heuristics based on the new context
    if (intent.trim()) {
      const autoHeuristics = selectHeuristics(intent, newContext);
      setSelectedHeuristics(autoHeuristics);
    }
    
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
  };
}
