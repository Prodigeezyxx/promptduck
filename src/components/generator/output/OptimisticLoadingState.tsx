
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader } from 'lucide-react';
import { ModeType } from '@/types';
import { 
  getIntentPrediction, 
  getHeuristicsPrediction, 
  getOptimisticPrompt,
  calculateConfidence
} from '@/services/optimistic/optimisticPromptGenerator';

interface OptimisticLoadingStateProps {
  intent: string;
  context?: string;
  mode: ModeType;
}

interface LoadingStep {
  text: string;
  prediction: string | string[] | null;
  type: 'text' | 'list' | 'prompt';
}

export function OptimisticLoadingState({ intent, context = '', mode }: OptimisticLoadingStateProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPrediction, setShowPrediction] = useState(false);

  const steps: LoadingStep[] = [
    { 
      text: "Understanding your request...", 
      prediction: getIntentPrediction(intent),
      type: 'text'
    },
    { 
      text: "Selecting enhancement strategies...", 
      prediction: getHeuristicsPrediction(intent),
      type: 'list'
    },
    { 
      text: "Building your enhanced prompt...", 
      prediction: getOptimisticPrompt(intent, context, mode),
      type: 'prompt'
    },
    { 
      text: "Polishing and finalizing...", 
      prediction: null,
      type: 'text'
    }
  ];

  const confidence = calculateConfidence(intent, context);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1200);

    // Show prediction after a brief delay
    const predictionTimer = setTimeout(() => setShowPrediction(true), 300);

    return () => {
      clearInterval(timer);
      clearTimeout(predictionTimer);
    };
  }, []);

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Confidence Badge */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs">
          Prediction Confidence: {Math.round(confidence * 100)}%
        </Badge>
        <Badge variant={mode === 'builder' ? 'default' : 'secondary'} className="text-xs">
          {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
        </Badge>
      </div>

      {/* Current Step Progress */}
      <div className="flex items-center space-x-3">
        <Loader className="animate-spin h-5 w-5 text-accent" />
        <span className="text-sm font-medium">{currentStepData.text}</span>
        <div className="flex space-x-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentStep ? 'bg-accent' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Prediction Preview */}
      {showPrediction && currentStepData.prediction && (
          <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-accent/50 animate-slide-in">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-secondaryText">
                {currentStepData.type === 'prompt' ? 'Enhancement Preview' : 'Preview'}
              </div>
              <Badge variant="outline" className="text-xs opacity-75">
                Processing...
              </Badge>
            </div>
          
          {currentStepData.type === 'list' && Array.isArray(currentStepData.prediction) ? (
            <div className="space-y-2">
              {(currentStepData.prediction as string[]).map((item, index) => (
                <div 
                  key={index} 
                  className="text-sm text-primaryText animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item}
                </div>
              ))}
            </div>
          ) : currentStepData.type === 'prompt' ? (
            <div className="font-mono text-sm text-primaryText whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto mobile-scroll">
              {currentStepData.prediction as string}
            </div>
          ) : (
            <div className="text-sm text-primaryText font-medium">
              {currentStepData.prediction as string}
            </div>
          )}
        </div>
      )}

      {/* Progress Message */}
      <div className="text-center">
        <p className="text-xs text-secondaryText">
          This preview shows our enhancement process while crafting your perfect prompt...
        </p>
      </div>
    </div>
  );
}
