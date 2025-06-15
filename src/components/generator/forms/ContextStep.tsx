
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FormSection } from './FormSection';
import { CharacterCounter } from './CharacterCounter';

interface ContextStepProps {
  context: string;
  placeholder: string;
  complexity: 'simple' | 'intermediate' | 'advanced';
  onContextChange: (value: string) => void;
  onComplexityChange: (value: 'simple' | 'intermediate' | 'advanced') => void;
}

const COMPLEXITY_INFO = {
  simple: {
    description: 'Basic prompts for straightforward tasks',
    examples: 'Quick questions, Simple instructions',
  },
  intermediate: {
    description: 'Balanced prompts with moderate detail',
    examples: 'Content strategy, Analysis, Guides',
  },
  advanced: {
    description: 'Sophisticated prompts with comprehensive context',
    examples: 'Complex reasoning, Multi-step tasks',
  }
};

export function ContextStep({ 
  context, 
  placeholder, 
  complexity,
  onContextChange,
  onComplexityChange 
}: ContextStepProps) {
  return (
    <FormSection
      title="Add Context"
      description="Provide additional details to improve your prompt"
      step={2}
      totalSteps={3}
    >
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-primaryText mb-3 block">
            Additional Context (Optional)
          </label>
          <Textarea
            placeholder={placeholder}
            value={context}
            onChange={(e) => onContextChange(e.target.value)}
            rows={3}
            className="resize-none text-base bg-input border-0"
          />
          <CharacterCounter current={context.length} max={300} className="mt-2" />
        </div>

        <div>
          <label className="text-sm font-medium text-primaryText mb-3 block">
            Complexity Level
          </label>
          <Select value={complexity} onValueChange={onComplexityChange}>
            <SelectTrigger className="min-h-[48px] text-base bg-input border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-surface border-0 shadow-elevation-2">
              {Object.entries(COMPLEXITY_INFO).map(([level, info]) => (
                <SelectItem key={level} value={level} className="text-base focus:bg-input">
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-brand-500 text-white">{level}</Badge>
                    <div>
                      <div className="font-medium text-primaryText">{info.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-secondaryText mt-2">
            <span className="font-medium">Examples:</span> {COMPLEXITY_INFO[complexity].examples}
          </p>
        </div>
      </div>
    </FormSection>
  );
}
