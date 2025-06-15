
import React, { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HeuristicType } from "@/types";
import { CompactHeuristicsDisplay } from "./CompactHeuristicsDisplay";
import { TemplateReference } from "./TemplateReference";
import { StepNavigation } from "./forms/StepNavigation";
import { IntentStep } from "./forms/IntentStep";
import { ContextStep } from "./forms/ContextStep";
import { GenerateStep } from "./forms/GenerateStep";
import { ProgressIndicator } from "./forms/ProgressIndicator";
import { useSmartPlaceholder } from "@/hooks/useSmartPlaceholder";
import { usePromptStore } from "@/store/promptStore";
import { motion, AnimatePresence } from "framer-motion";

interface EnhancedAIGeneratorInputPanelProps {
  intent: string;
  context: string;
  complexity: "simple" | "intermediate" | "advanced";
  selectedHeuristics: HeuristicType[];
  isGenerating: boolean;
  onIntentChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onComplexityChange: (
    value: "simple" | "intermediate" | "advanced"
  ) => void;
  onGenerate: () => void;
}

const STEPS = [
  { id: "intent", title: "Intent", description: "What you want" },
  { id: "context", title: "Context", description: "Additional details" },
  { id: "generate", title: "Generate", description: "Create prompt" },
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
  onGenerate,
}: EnhancedAIGeneratorInputPanelProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const { currentPrompt, setCurrentPrompt } = usePromptStore();

  const intentPlaceholder = useSmartPlaceholder(complexity, "intent");
  const contextPlaceholder = useSmartPlaceholder(complexity, "context");

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
  }, [intent, currentStep, context]);

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

  const canProceed = currentStep === 1 ? intent.trim().length >= 10 : true;

  return (
    <TooltipProvider>
      <div className="space-y-8 min-h-screen flex flex-col justify-start">
        {/* Progress Indicator at top */}
        <ProgressIndicator
          steps={STEPS}
          currentStep={currentStep}
          className="mx-0"
        />

        {/* Template Reference Panel */}
        {currentPrompt && (
          <TemplateReference
            template={currentPrompt}
            onClose={() => setCurrentPrompt(null)}
            onUseAsStartingPoint={() => {
              onIntentChange(currentPrompt.title);
              onContextChange(currentPrompt.description || "");
              setCurrentPrompt(null);
            }}
          />
        )}

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
                complexity={complexity}
                onContextChange={onContextChange}
                onComplexityChange={onComplexityChange}
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
