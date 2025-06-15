
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  description?: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function ProgressIndicator({ steps, currentStep, className }: ProgressIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300",
                  isCompleted && "bg-brand-500 border-brand-500 text-white",
                  isCurrent && "border-brand-500 text-brand-500 bg-brand-50 dark:bg-brand-950",
                  isUpcoming && "border-muted text-muted-foreground"
                )}>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </div>
                <div className="text-center mt-2">
                  <div className={cn(
                    "text-sm font-medium",
                    (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-muted-foreground mt-1 max-w-24">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-4 transition-colors duration-300",
                  stepNumber < currentStep ? "bg-brand-500" : "bg-muted"
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
