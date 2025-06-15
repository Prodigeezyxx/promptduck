
import React, { useState, useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { HeuristicType } from '@/types';
import { CompactHeuristicsDisplay } from './CompactHeuristicsDisplay';
import { TemplateReference } from './TemplateReference';
import { FormSection } from './forms/FormSection';
import { ProgressIndicator } from './forms/ProgressIndicator';
import { StepNavigation } from './forms/StepNavigation';
import { IntentStep } from './forms/IntentStep';
import { ContextStep } from './forms/ContextStep';
import { GenerateStep } from './forms/GenerateStep';
import { useSmartPlaceholder } from '@/hooks/useSmartPlaceholder';
import { usePromptStore } from '@/store/promptStore';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedAIGeneratorInputPanelProps {
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

const STEPS = [
  { id: 'intent', title: 'Define Intent', description: 'What do you want to achieve?' },
  { id: 'context', title: 'Add Context', description: 'Provide additional details' },
  { id: 'generate', title: 'Generate', description: 'Create your optimized prompt' }
];

export function EnhancedAIGeneratorInputPanel({
  intent,
  context,
  complexity,
  selectedHeuristics,
  isGenerating,
  onIntentChange,
  onContextChange,
  onComplexityChange,
  onGenerate
}: EnhancedAIGeneratorInputPanelProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const { currentPrompt, setCurrentPrompt } = usePromptStore();
  
  const intentPlaceholder = useSmartPlaceholder(complexity, 'intent');
  const contextPlaceholder = useSmartPlaceholder(complexity, 'context');

  useEffect(() => {
    // Auto-advance steps based on completion
    const newCompletedSteps = [];
    if (intent.trim().length > 10) newCompletedSteps.push(1);
    if (context.trim().length > 0 || intent.trim().length > 50) newCompletedSteps.push(2);
    
    setCompletedSteps(newCompletedSteps);
    
    // Auto-advance to next step if current is completed
    if (currentStep === 1 && intent.trim().length > 10 && currentStep < 3) {
      setTimeout(() => setCurrentStep(2), 500);
    }
  }, [intent, currentStep]);

  const handleIntentChange = (value: string) => {
    onIntentChange(value);
    setShowValidation(true);
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = () => {
    if (!intent.trim()) {
      setShowValidation(true);
      return;
    }
    setCurrentStep(3);
    onGenerate();
  };

  const getStepProgress = () => {
    if (completedSteps.includes(1) && completedSteps.includes(2)) return 100;
    if (completedSteps.includes(1)) return 66;
    if (intent.trim().length > 5) return 33;
    return 0;
  };

  const canProceed = currentStep === 1 ? intent.trim().length >= 10 : true;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Template Reference Panel */}
        {currentPrompt && (
          <TemplateReference
            template={currentPrompt}
            onClose={() => setCurrentPrompt(null)}
            onUseAsStartingPoint={() => {
              onIntentChange(currentPrompt.title);
              onContextChange(currentPrompt.description || '');
              setCurrentPrompt(null);
            }}
          />
        )}

        {/* Progress Indicator */}
        <FormSection 
          title="Prompt Creation Progress"
          description={`${Math.round(getStepProgress())}% Complete`}
          className="bg-gradient-to-r from-brand-50 to-purple-50 border-brand-200"
        >
          <ProgressIndicator 
            steps={STEPS} 
            currentStep={currentStep}
            className="mb-4"
          />
        </FormSection>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <IntentStep
                intent={intent}
                complexity={complexity}
                placeholder={intentPlaceholder}
                showValidation={showValidation}
                onIntentChange={handleIntentChange}
                onComplexityChange={onComplexityChange}
              />
            )}

            {currentStep === 2 && (
              <ContextStep
                context={context}
                placeholder={contextPlaceholder}
                onContextChange={onContextChange}
              />
            )}

            {currentStep === 3 && (
              <GenerateStep
                intent={intent}
                context={context}
                complexity={complexity}
                isGenerating={isGenerating}
                onGenerate={handleGenerate}
              />
            )}

            {/* Navigation Buttons */}
            <StepNavigation
              currentStep={currentStep}
              canProceed={canProceed}
              onPrevious={handlePrevStep}
              onNext={handleNextStep}
            />
          </motion.div>
        </AnimatePresence>

        {/* Heuristics Display */}
        {selectedHeuristics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CompactHeuristicsDisplay selectedHeuristics={selectedHeuristics} />
          </motion.div>
        )}
      </div>
    </TooltipProvider>
  );
}
