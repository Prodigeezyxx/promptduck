
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Sparkles } from 'lucide-react';
import { HeuristicType } from '@/types';
import { HeuristicsDisplay } from './HeuristicsDisplay';

interface AIGeneratorInputPanelProps {
  intent: string;
  context: string;
  complexity: 'simple' | 'intermediate' | 'advanced';
  selectedHeuristics: HeuristicType[];
  isGenerating: boolean;
  onIntentChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onComplexityChange: (value: 'simple' | 'intermediate' | 'advanced') => void;
  onGenerate: () => void;
}

export function AIGeneratorInputPanel({
  intent,
  context,
  complexity,
  selectedHeuristics,
  isGenerating,
  onIntentChange,
  onContextChange,
  onComplexityChange,
  onGenerate
}: AIGeneratorInputPanelProps) {
  return (
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
              onChange={(e) => onIntentChange(e.target.value)}
              rows={3}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Additional Context (Optional)</label>
            <Textarea
              placeholder="Any specific requirements, constraints, or background information..."
              value={context}
              onChange={(e) => onContextChange(e.target.value)}
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
            <Select value={complexity} onValueChange={onComplexityChange}>
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
        <HeuristicsDisplay selectedHeuristics={selectedHeuristics} />
      )}

      <Button 
        onClick={onGenerate} 
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
  );
}
