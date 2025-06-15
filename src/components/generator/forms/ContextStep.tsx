
import { Textarea } from '@/components/ui/textarea';
import { FormSection } from './FormSection';
import { CharacterCounter } from './CharacterCounter';

interface ContextStepProps {
  context: string;
  placeholder: string;
  onContextChange: (value: string) => void;
}

export function ContextStep({ context, placeholder, onContextChange }: ContextStepProps) {
  return (
    <FormSection
      title="Add Context"
      description="Provide additional details to improve your prompt"
      step={2}
      totalSteps={3}
    >
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Additional Context (Optional)</label>
            <span className="text-xs text-gray-500">{context.length} characters</span>
          </div>
          <Textarea
            placeholder={placeholder}
            value={context}
            onChange={(e) => onContextChange(e.target.value)}
            rows={3}
            className="resize-none text-base"
          />
          <CharacterCounter current={context.length} max={300} className="mt-2" />
          <p className="text-sm text-gray-600 mt-1">
            Add specific requirements, constraints, or background information to improve your prompt.
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tips for Better Context:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Specify your target audience</li>
            <li>• Mention desired tone or style</li>
            <li>• Include format preferences</li>
            <li>• Add any constraints or limitations</li>
          </ul>
        </div>
      </div>
    </FormSection>
  );
}
