
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
    <nav className={cn("flex items-center justify-center space-x-8 mt-2 mb-6", className)}>
      {steps.map((step, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center border-2 mb-2 transition-colors bg-surface",
                isActive
                  ? "border-brand-500 bg-brand-900/50"
                  : isCompleted
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-muted-foreground text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <CheckCircle className="w-6 h-6" />
              ) : isActive ? (
                <Clock className="w-6 h-6 text-brand-400" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </div>
            <span
              className={cn(
                "text-sm font-medium text-center",
                isActive || isCompleted ? "text-brand-500" : "text-muted-foreground"
              )}
            >
              {step.title}
            </span>
            {step.description && (
              <span className="text-xs text-muted-foreground text-center">{step.description}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
