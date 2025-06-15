
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from "./FormSection";
import { CharacterCounter } from "./CharacterCounter";

interface IntentStepProps {
  intent: string;
  complexity: 'simple' | 'intermediate' | 'advanced';
  placeholder: string;
  showValidation: boolean;
  onIntentChange: (value: string) => void;
  onComplexityChange: (value: 'simple' | 'intermediate' | 'advanced') => void;
}

export function IntentStep({
  intent,
  placeholder,
  showValidation,
  onIntentChange,
}: IntentStepProps) {
  const isValid = intent.length > 10;

  return (
    <FormSection
      title="What do you want to achieve?"
      description="Describe your goal or what you want the prompt to help with"
      step={1}
      totalSteps={3}
      className="mb-2"
    >
      <div>
        <Textarea
          placeholder={placeholder}
          value={intent}
          onChange={(e) => onIntentChange(e.target.value)}
          rows={4}
          className="resize-none text-lg bg-input border-none text-primaryText font-medium shadow-inner mt-4"
        />
        <CharacterCounter current={intent.length} max={500} className="mt-3" />
        {showValidation && !intent.trim() && (
          <div className="text-destructive text-xs mt-1">Please enter your intent.</div>
        )}
      </div>
    </FormSection>
  );
}
