
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
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-brand-900/20 to-purple-900/20 p-6 rounded-lg border border-brand-500/20">
          <h4 className="font-semibold text-brand-400 mb-4">Ready to Generate Your Optimized Prompt!</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-secondaryText">Intent:</span>
                <span className="text-primaryText ml-2">{intent.slice(0, 100)}{intent.length > 100 ? '...' : ''}</span>
              </div>
            </div>
            {context && (
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-secondaryText">Context:</span>
                  <span className="text-primaryText ml-2">{context.slice(0, 100)}{context.length > 100 ? '...' : ''}</span>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <div>
                <span className="text-secondaryText">Complexity:</span>
                <span className="text-primaryText ml-2 capitalize">{complexity}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={onGenerate} 
            disabled={isGenerating || !intent.trim()}
            className="w-full bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 min-h-[56px] text-lg font-medium border-0"
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
          <p className="text-center text-sm text-secondaryText">
            AI-powered with 5 heuristics
          </p>
        </div>
      </div>
    </FormSection>
  );
}
