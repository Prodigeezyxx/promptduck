
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
      title="Review & Generate"
      description="Check your details and create your optimized prompt"
    >
      <div className="space-y-4">
        <div className="bg-background/70 border border-border rounded-md px-4 py-4 flex flex-col gap-2">
          <div className="flex items-start gap-2 text-xs text-secondaryText">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span>
              <span className="font-semibold text-primaryText">Intent:</span>
              <span className="ml-2">{intent.slice(0, 100)}{intent.length > 100 ? '...' : ''}</span>
            </span>
          </div>
          {context && (
            <div className="flex items-start gap-2 text-xs text-secondaryText">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>
                <span className="font-semibold text-primaryText">Context:</span>
                <span className="ml-2">{context.slice(0, 100)}{context.length > 100 ? '...' : ''}</span>
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-secondaryText">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>
              <span className="font-semibold text-primaryText">Complexity:</span>
              <span className="ml-2 capitalize">{complexity}</span>
            </span>
          </div>
        </div>

        <Button 
          onClick={onGenerate} 
          disabled={isGenerating || !intent.trim()}
          className="w-full bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 min-h-[48px] text-base font-medium border-none"
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
    </FormSection>
  );
}
