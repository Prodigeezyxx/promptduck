
import { useState } from 'react';
import { useGeneratorStore } from '@/store/generatorStore';
import { useCreditStore } from '@/store/creditStore';
import { useApiKeyStore } from '@/store/apiKeyStore';
import { usePromptStore } from '@/store/promptStore';
import { geminiService } from '@/services/geminiService';
import { selectHeuristics } from '@/utils/heuristicSelector';
import { ApiKeyRequired } from '@/components/ApiKeyRequired';
import { AIGeneratorInputPanel } from '@/components/generator/AIGeneratorInputPanel';
import { AIGeneratorOutputPanel } from '@/components/generator/AIGeneratorOutputPanel';
import { Wand2 } from 'lucide-react';
import { HeuristicType, GenerationRequest } from '@/types';
import { toast } from '@/hooks/use-toast';

export default function AIGeneratorPage() {
  const { isGenerating, lastResult, setGenerating, setLastResult } = useGeneratorStore();
  const { useCredit, canUseCredit, getRemainingCredits } = useCreditStore();
  const { apiKey } = useApiKeyStore();
  const { addPrompt } = usePromptStore();

  const [intent, setIntent] = useState('');
  const [context, setContext] = useState('');
  const [complexity, setComplexity] = useState<'simple' | 'intermediate' | 'advanced'>('intermediate');
  const [selectedHeuristics, setSelectedHeuristics] = useState<HeuristicType[]>([]);

  if (!apiKey) {
    return <ApiKeyRequired />;
  }

  // Update heuristics when intent or context changes
  const handleIntentChange = (value: string) => {
    setIntent(value);
    if (value.trim()) {
      const autoHeuristics = selectHeuristics(value, context);
      setSelectedHeuristics(autoHeuristics);
    }
  };

  const handleContextChange = (value: string) => {
    setContext(value);
    if (intent.trim()) {
      const autoHeuristics = selectHeuristics(intent, value);
      setSelectedHeuristics(autoHeuristics);
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

      const request: GenerationRequest = {
        intent,
        heuristics: heuristicsToUse,
        context: context.trim() || undefined,
        complexity
      };

      const result = await geminiService.generatePrompt(request);
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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <Wand2 className="w-8 h-8 mr-3 text-brand-500" />
          AI Prompt Generator
        </h1>
        <p className="text-muted-foreground">
          Transform your ideas using intelligently selected cognitive heuristics
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <AIGeneratorInputPanel
          intent={intent}
          context={context}
          complexity={complexity}
          selectedHeuristics={selectedHeuristics}
          isGenerating={isGenerating}
          onIntentChange={handleIntentChange}
          onContextChange={handleContextChange}
          onComplexityChange={setComplexity}
          onGenerate={handleGenerate}
        />

        {/* Output Panel */}
        <AIGeneratorOutputPanel
          lastResult={lastResult}
          onCopyPrompt={handleCopyPrompt}
          onSavePrompt={handleSavePrompt}
          onRemixSuggestion={handleRemixSuggestion}
        />
      </div>
    </div>
  );
}
