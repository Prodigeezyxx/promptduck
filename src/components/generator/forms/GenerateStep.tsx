
import { Button } from '@/components/ui/button';
import { RefreshCw, Sparkles, CheckCircle } from 'lucide-react';
import { FormSection } from './FormSection';

interface GenerateStepProps {
  intent: string;
  context: string;
  complexity: 'simple' | 'intermediate' | 'advanced';
  isGenerating: boolean;
  onGenerate: () => void;
}

export function GenerateStep({ 
  intent, 
  context, 
  complexity, 
  isGenerating, 
  onGenerate 
}: GenerateStepProps) {
  return (
    <FormSection
      title="Generate Prompt"
      description="Review your settings and create your optimized prompt"
      step={3}
      totalSteps={3}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-brand-50 to-purple-50 p-6 rounded-lg border border-brand-200">
          <h4 className="font-semibold text-brand-900 mb-3">Ready to Generate Your Optimized Prompt!</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span><strong>Intent:</strong> {intent.slice(0, 100)}{intent.length > 100 ? '...' : ''}</span>
            </div>
            {context && (
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span><strong>Context:</strong> {context.slice(0, 100)}{context.length > 100 ? '...' : ''}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span><strong>Complexity:</strong> {complexity}</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={onGenerate} 
          disabled={isGenerating || !intent.trim()}
          className="w-full bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 min-h-[56px] text-lg font-medium"
          size="lg"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Generating Your Optimized Prompt...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Optimized Prompt
            </>
          )}
        </Button>
      </div>
    </FormSection>
  );
}
