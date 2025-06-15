
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle } from 'lucide-react';
import { FormSection } from './FormSection';
import { CharacterCounter } from './CharacterCounter';
import { motion } from 'framer-motion';

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
  complexity,
  placeholder,
  showValidation,
  onIntentChange,
  onComplexityChange
}: IntentStepProps) {
  const isValid = intent.length > 10;

  return (
    <FormSection
      title="Define Intent"
      description="What do you want to achieve?"
      step={1}
      totalSteps={3}
    >
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-primaryText">What do you want to achieve? *</label>
            <div className="flex items-center space-x-2">
              {intent.length > 10 && <CheckCircle className="w-4 h-4 text-green-500" />}
            </div>
          </div>
          <Textarea
            placeholder={placeholder}
            value={intent}
            onChange={(e) => onIntentChange(e.target.value)}
            rows={4}
            className={`resize-none text-base bg-input border-0 ${
              showValidation && !intent.trim() 
                ? 'ring-2 ring-red-500' 
                : intent.length > 10
                ? 'ring-2 ring-green-500'
                : ''
            }`}
          />
          <CharacterCounter current={intent.length} max={500} className="mt-2" />
          {showValidation && !intent.trim() && (
            <p className="text-red-500 text-sm mt-1">Please describe your intent</p>
          )}
          {intent.length > 10 && (
            <p className="text-green-600 text-sm mt-1">Great! Your intent is clear and detailed.</p>
          )}
        </div>

        {isValid && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-green-500"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Step 1 Complete!</span>
          </motion.div>
        )}
      </div>
    </FormSection>
  );
}
