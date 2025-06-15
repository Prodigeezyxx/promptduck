
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
    >
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-primaryText">Your Goal *</label>
            <div className="flex items-center space-x-1">
              {intent.length > 10 && <CheckCircle className="w-4 h-4 text-green-500" />}
            </div>
          </div>
          <Textarea
            placeholder={placeholder}
            value={intent}
            onChange={(e) => onIntentChange(e.target.value)}
            rows={4}
            className={`resize-none text-sm bg-input border-0 focus:ring-1 focus:ring-brand-600`}
          />
          <CharacterCounter current={intent.length} max={500} className="mt-1" />
          {showValidation && !intent.trim() && (
            <p className="text-red-500 text-xs mt-1">Please describe your intent</p>
          )}
          {intent.length > 10 && (
            <p className="text-green-600 text-xs mt-1">Looks good!</p>
          )}
        </div>
        {isValid && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-green-500 text-xs"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">Step complete!</span>
          </motion.div>
        )}
      </div>
    </FormSection>
  );
}
