
import { useState } from 'react';
import { useGeneratorStore } from '@/store/generatorStore';
import { useCreditStore } from '@/store/creditStore';
import { useApiKeyStore } from '@/store/apiKeyStore';
import { usePromptStore } from '@/store/promptStore';
import { geminiService } from '@/services/geminiService';
import { selectHeuristics } from '@/utils/heuristicSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApiKeyRequired } from '@/components/ApiKeyRequired';
import { Wand2, Save, Copy, RefreshCw, Sparkles, Brain } from 'lucide-react';
import { HEURISTICS } from '@/constants';
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
        description: `Applied: ${heuristicsToUse.map(h => HEURISTICS[h].name).join(', ')}` 
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

  const toggleHeuristic = (heuristic: HeuristicType) => {
    setSelectedHeuristics(prev => 
      prev.includes(heuristic)
        ? prev.filter(h => h !== heuristic)
        : [...prev, heuristic]
    );
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
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intent & Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">What do you want to achieve?</label>
                <Textarea
                  placeholder="Describe your goal or what you want the prompt to help with..."
                  value={intent}
                  onChange={(e) => handleIntentChange(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Additional Context (Optional)</label>
                <Textarea
                  placeholder="Any specific requirements, constraints, or background information..."
                  value={context}
                  onChange={(e) => handleContextChange(e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Complexity</label>
                <Select value={complexity} onValueChange={(value) => setComplexity(value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {selectedHeuristics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Auto-Selected Heuristics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedHeuristics.map((heuristic) => (
                    <div key={heuristic} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-brand-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {HEURISTICS[heuristic].name}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {HEURISTICS[heuristic].description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  These heuristics were automatically selected based on your intent and context.
                </p>
              </CardContent>
            </Card>
          )}

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !intent.trim()}
            className="w-full bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Prompt
              </>
            )}
          </Button>
        </div>

        {/* Output Panel */}
        <div className="space-y-6">
          {lastResult ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{lastResult.preview_title}</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={handleCopyPrompt}>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleSavePrompt}>
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prompt-editor bg-muted/50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">{lastResult.optimized_prompt}</pre>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {lastResult.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Metadata & Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Complexity:</span>
                      <span className="ml-2 font-medium">{lastResult.metadata.complexity_score}/10</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Creativity:</span>
                      <span className="ml-2 font-medium">{lastResult.metadata.creativity_score}/10</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Coherence:</span>
                      <span className="ml-2 font-medium">{lastResult.metadata.coherence_score}/10</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Est. Tokens:</span>
                      <span className="ml-2 font-medium">{lastResult.metadata.estimated_tokens}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Remix Suggestions:</h4>
                    <div className="space-y-2">
                      {lastResult.remix_suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left h-auto py-2"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Wand2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Your generated prompt will appear here</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
