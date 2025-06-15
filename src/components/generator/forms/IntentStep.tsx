
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle } from 'lucide-react';
import { FormSection } from './FormSection';
import { CharacterCounter } from './CharacterCounter';
import { ComplexitySelector } from './ComplexitySelector';
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
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">What do you want to achieve? *</label>
            <div className="flex items-center space-x-2">
              <span className={`text-xs ${intent.length > 10 ? 'text-green-600' : 'text-gray-500'}`}>
                {intent.length} characters
              </span>
              {intent.length > 10 && <CheckCircle className="w-4 h-4 text-green-500" />}
            </div>
          </div>
          <Textarea
            placeholder={placeholder}
            value={intent}
            onChange={(e) => onIntentChange(e.target.value)}
            rows={4}
            className={`resize-none text-base transition-all ${
              showValidation && !intent.trim() 
                ? 'border-red-300 focus:border-red-500' 
                : intent.length > 10
                ? 'border-green-300 focus:border-green-500'
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

        <ComplexitySelector value={complexity} onChange={onComplexityChange} />

        {isValid && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 p-4 rounded-lg border border-green-200"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-800 font-medium">Step 1 Complete!</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Your intent is well-defined. Ready to add context or generate your prompt.
            </p>
          </motion.div>
        )}
      </div>
    </FormSection>
  );
}
