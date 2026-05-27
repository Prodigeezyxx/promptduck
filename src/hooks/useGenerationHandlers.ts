import { useAuthContext } from '@/components/auth/AuthProvider';
import { useCreditStore } from '@/store/creditStore';
import { usePromptStore } from '@/store/promptStore';
import { useGeneratorStore } from '@/store/generatorStore';
import { useSupabasePrompts } from './useSupabasePrompts';
import { useSupabaseGenerations } from './useSupabaseGenerations';
import { openaiService } from '@/services/openaiService';
import { selectHeuristics } from '@/utils/heuristicSelector';
import { GenerationRequest, GenerationResult, ModeType } from '@/types';
import { DEFAULT_MODE } from '@/constants/modes';
import { toast } from '@/hooks/use-toast';

export function useGenerationHandlers() {
  const { user } = useAuthContext();
  const isRealUser = user && !(user as any).isGuest;
  const { useCredit, canUseCredit, getRemainingCredits } = useCreditStore();
  const { addPrompt, setCurrentPrompt } = usePromptStore();
  const { setGenerating, setLastResult, lastResult } = useGeneratorStore();
  
  // Supabase hooks
  const { savePrompt: saveToSupabase } = useSupabasePrompts();
  const { saveGeneration } = useSupabaseGenerations();

  const handleGenerate = async (
    intent: string,
    context: string,
    selectedMode: ModeType,
    isAutoGeneration = false
  ) => {
    if (!intent.trim()) {
      if (!isAutoGeneration) {
        toast({ title: 'Error', description: 'Please describe your intent' });
      }
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
      if (!isAutoGeneration) {
        toast({ title: 'Error', description: 'Unable to use credit' });
      }
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
        complexity: 'intermediate',
        mode: selectedMode
      };

      console.log('Generation request object:', JSON.stringify(request, null, 2));

      const result = await openaiService.generatePrompt(request);
      console.log('Generation result received:', result);
      
      setLastResult(result);
      
      // Save to Supabase if user is authenticated
      if (isRealUser) {
        await saveGeneration(result, intent.trim(), contextValue);
      }
      
      toast({ 
        title: isAutoGeneration ? 'Template optimized!' : 'Prompt generated!', 
        description: `Applied ${heuristicsToUse.length} cognitive heuristics with ${selectedMode} mode optimization` 
      });
    } catch (error) {
      console.error('Generation error:', error);
      if (!isAutoGeneration) {
        toast({ 
          title: 'Generation failed', 
          description: 'Please try again in a moment.' 
        });
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleSavePrompt = async (intent: string, context: string, mode?: ModeType) => {
    if (!lastResult) return;

    // Create a meaningful title from the preview title or intent
    const promptTitle = lastResult.preview_title || intent.slice(0, 60) + (intent.length > 60 ? '...' : '');
    
    // Enhanced metadata for Builder mode
    const isBuilderMode = mode === 'builder';
    const baseCategory: 'product_thinking' | 'general' = isBuilderMode ? 'product_thinking' : 'general';
    
    const promptData = {
      title: promptTitle,
      content: lastResult.optimized_prompt || lastResult.result,
      description: isBuilderMode ? 
        `Builder R-T-C-F-G prompt: ${intent}` : 
        intent,
      tags: lastResult.tags || (isBuilderMode ? ['builder', 'rtcfg', 'app-development'] : []),
      persona: isBuilderMode ? 'builder' as const : 'strategist' as const,
      heuristics: lastResult.heuristics || [],
      variables: [
        ...(context ? [{
          name: 'original_context',
          type: 'text' as const,
          required: false,
          description: context
        }] : []),
        ...(isBuilderMode && lastResult.metadata?.project_type ? [{
          name: 'app_type',
          type: 'text' as const,
          required: false,
          description: lastResult.metadata.project_type
        }] : []),
        ...(lastResult.variables || [])
      ],
      category: baseCategory,
      difficulty: isBuilderMode ? 'advanced' as const : 'intermediate' as const,
      estimatedTime: isBuilderMode ? '30 minutes' : '15 minutes'
    };

    if (isRealUser) {
      const saved = await saveToSupabase(promptData);
      if (saved) {
        toast({ 
          title: 'Saved!', 
          description: isBuilderMode ? 
            'Builder prompt saved with R-T-C-F-G structure and AI insights!' : 
            'Prompt added to your cloud library with original intent preserved.' 
        });
      }
    } else {
      addPrompt(promptData);
      toast({ 
        title: 'Saved!', 
        description: isBuilderMode ? 
          'Builder prompt saved locally with enhanced metadata!' : 
          'Prompt added to your local library with original intent preserved.' 
      });
    }
  };

  const handleCopyPrompt = () => {
    if (!lastResult) return;
    
    navigator.clipboard.writeText(lastResult.optimized_prompt || lastResult.result);
    toast({ title: 'Copied!', description: 'Refined prompt copied to clipboard.' });
  };

  const handleRemixSuggestion = (suggestion: string, context: string, setContext: (value: string) => void) => {
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

  const handleClearTemplate = (setIntent: (value: string) => void, setContext: (value: string) => void) => {
    setCurrentPrompt(null);
    setIntent('');
    setContext('');
  };

  const handleStartNewPrompt = (
    setIntent: (value: string) => void, 
    setContext: (value: string) => void, 
    setSelectedMode: (mode: ModeType) => void
  ) => {
    setIntent('');
    setContext('');
    setSelectedMode(DEFAULT_MODE);
    setCurrentPrompt(null);
    setLastResult(null);
  };

  return {
    handleGenerate,
    handleSavePrompt,
    handleCopyPrompt,
    handleRemixSuggestion,
    handleSelectHistoryResult,
    handleClearTemplate,
    handleStartNewPrompt,
  };
}