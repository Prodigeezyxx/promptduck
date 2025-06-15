
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RefreshCw, Sparkles, ChevronRight, ChevronLeft, HelpCircle, CheckCircle, Target, Settings, Zap } from 'lucide-react';
import { HeuristicType } from '@/types';
import { CompactHeuristicsDisplay } from './CompactHeuristicsDisplay';
import { TemplateReference } from './TemplateReference';
import { FormSection } from './forms/FormSection';
import { CharacterCounter } from './forms/CharacterCounter';
import { ProgressIndicator } from './forms/ProgressIndicator';
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

const COMPLEXITY_INFO = {
  simple: {
    description: 'Basic prompts for straightforward tasks',
    example: 'Perfect for quick questions or simple instructions',
    color: 'bg-green-100 text-green-800'
  },
  intermediate: {
    description: 'Balanced prompts with moderate detail',
    example: 'Ideal for most creative and analytical tasks',
    color: 'bg-blue-100 text-blue-800'
  },
  advanced: {
    description: 'Sophisticated prompts with comprehensive context',
    example: 'Best for complex, multi-step reasoning tasks',
    color: 'bg-purple-100 text-purple-800'
  }
};

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

  const isStepComplete = (stepId: number) => completedSteps.includes(stepId);

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
            {/* Step 1: Intent */}
            {currentStep === 1 && (
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
                      placeholder={intentPlaceholder}
                      value={intent}
                      onChange={(e) => handleIntentChange(e.target.value)}
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

                  {/* Complexity Selection */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Complexity Level</label>
                    <Select value={complexity} onValueChange={onComplexityChange}>
                      <SelectTrigger className="min-h-[48px] text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(COMPLEXITY_INFO).map(([level, info]) => (
                          <SelectItem key={level} value={level} className="text-base">
                            <div className="flex items-center space-x-2">
                              <Badge className={info.color}>{level}</Badge>
                              <div>
                                <div className="font-medium">{info.description}</div>
                                <div className="text-sm text-gray-600">{info.example}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {intent.trim().length > 10 && (
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
            )}

            {/* Step 2: Context */}
            {currentStep === 2 && (
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
                      placeholder={contextPlaceholder}
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
            )}

            {/* Step 3: Generate */}
            {currentStep === 3 && (
              <FormSection
                title="Generate Prompt"
                description="Review your settings and create your optimized prompt"
                step={3}
                totalSteps={3}
              >
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-brand-50 to-purple-50 p-6 rounded-lg border border-brand-200">
                    <h4 className="font-semibold text-brand-900 mb-3">Ready to Generate Your Optimized Prompt!</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span><strong>Intent:</strong> {intent.slice(0, 100)}{intent.length > 100 ? '...' : ''}</span>
                      </div>
                      {context && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span><strong>Context:</strong> {context.slice(0, 100)}{context.length > 100 ? '...' : ''}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span><strong>Complexity:</strong> {complexity}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating || !intent.trim()}
                    className="w-full bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 min-h-[56px] text-lg font-medium"
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
                </div>
              </FormSection>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="min-h-[44px]"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {currentStep < 3 && (
                <Button
                  onClick={handleNextStep}
                  disabled={currentStep === 1 && intent.trim().length < 10}
                  className="min-h-[44px]"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
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
