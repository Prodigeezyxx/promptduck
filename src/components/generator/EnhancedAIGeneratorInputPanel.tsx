
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RefreshCw, Sparkles, ChevronRight, ChevronLeft, HelpCircle, CheckCircle, Target, Settings, Zap } from 'lucide-react';
import { HeuristicType } from '@/types';
import { CompactHeuristicsDisplay } from './CompactHeuristicsDisplay';
import { TemplateReference } from './TemplateReference';
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
  { id: 1, title: 'Define Intent', icon: Target, description: 'What do you want to achieve?' },
  { id: 2, title: 'Add Context', icon: Settings, description: 'Provide additional details' },
  { id: 3, title: 'Generate', icon: Zap, description: 'Create your optimized prompt' }
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

const SMART_PLACEHOLDERS = {
  simple: {
    intent: 'e.g., "Write a brief summary of...", "Create a simple list of...", "Explain in basic terms..."',
    context: 'Any specific requirements or constraints...'
  },
  intermediate: {
    intent: 'e.g., "Analyze and compare...", "Create a detailed plan for...", "Write a comprehensive guide..."',
    context: 'Target audience, tone, format preferences, key points to include...'
  },
  advanced: {
    intent: 'e.g., "Develop a multi-step strategy...", "Create a sophisticated analysis...", "Design a complex framework..."',
    context: 'Detailed requirements, stakeholder considerations, constraints, success metrics, implementation timeline...'
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
  const [intentCharCount, setIntentCharCount] = useState(0);
  const [contextCharCount, setContextCharCount] = useState(0);
  const [showValidation, setShowValidation] = useState(false);
  const { currentPrompt, setCurrentPrompt } = usePromptStore();

  useEffect(() => {
    setIntentCharCount(intent.length);
    
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

  useEffect(() => {
    setContextCharCount(context.length);
  }, [context]);

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
  const isStepAccessible = (stepId: number) => stepId <= currentStep || isStepComplete(stepId);

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

        {/* Progress Header */}
        <Card className="bg-gradient-to-r from-brand-50 to-purple-50 border-brand-200">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-brand-900">Prompt Creation Progress</h3>
                  <span className="text-sm text-brand-600">{Math.round(getStepProgress())}% Complete</span>
                </div>
                <Progress value={getStepProgress()} className="h-2" />
              </div>

              {/* Step Indicators */}
              <div className="flex items-center justify-between">
                {STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isComplete = isStepComplete(step.id);
                  const isAccessible = isStepAccessible(step.id);

                  return (
                    <div key={step.id} className="flex items-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => isAccessible && setCurrentStep(step.id)}
                            disabled={!isAccessible}
                            className={`flex items-center space-x-2 p-3 rounded-lg transition-all ${
                              isActive
                                ? 'bg-brand-500 text-white shadow-md'
                                : isComplete
                                ? 'bg-green-500 text-white'
                                : isAccessible
                                ? 'bg-white text-brand-600 border border-brand-200 hover:bg-brand-50'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {isComplete ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <Icon className="w-5 h-5" />
                            )}
                            <span className="font-medium text-sm hidden sm:block">{step.title}</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-medium">{step.title}</p>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </TooltipContent>
                      </Tooltip>
                      {index < STEPS.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {React.createElement(STEPS[currentStep - 1].icon, { className: "w-5 h-5 text-brand-500" })}
                  <span>{STEPS[currentStep - 1].title}</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{STEPS[currentStep - 1].description}</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Intent */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">What do you want to achieve? *</label>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs ${intentCharCount > 10 ? 'text-green-600' : 'text-gray-500'}`}>
                            {intentCharCount} characters
                          </span>
                          {intentCharCount > 10 && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                      </div>
                      <Textarea
                        placeholder={SMART_PLACEHOLDERS[complexity].intent}
                        value={intent}
                        onChange={(e) => handleIntentChange(e.target.value)}
                        rows={4}
                        className={`resize-none text-base transition-all ${
                          showValidation && !intent.trim() 
                            ? 'border-red-300 focus:border-red-500' 
                            : intentCharCount > 10
                            ? 'border-green-300 focus:border-green-500'
                            : ''
                        }`}
                      />
                      {showValidation && !intent.trim() && (
                        <p className="text-red-500 text-sm mt-1">Please describe your intent</p>
                      )}
                      {intentCharCount > 10 && (
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
                )}

                {/* Step 2: Context */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Additional Context (Optional)</label>
                        <span className="text-xs text-gray-500">{contextCharCount} characters</span>
                      </div>
                      <Textarea
                        placeholder={SMART_PLACEHOLDERS[complexity].context}
                        value={context}
                        onChange={(e) => onContextChange(e.target.value)}
                        rows={3}
                        className="resize-none text-base"
                      />
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
                )}

                {/* Step 3: Generate */}
                {currentStep === 3 && (
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
              </CardContent>
            </Card>
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
