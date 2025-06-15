
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  step?: number;
  totalSteps?: number;
}

export function FormSection({ 
  title, 
  description, 
  children, 
  className,
  step,
  totalSteps 
}: FormSectionProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-primaryText flex items-center gap-3">
          {step && totalSteps && (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-brand-500 to-purple-600 text-white text-sm font-medium">
              {step}
            </div>
          )}
          {title}
          {step && totalSteps && (
            <span className="text-sm text-secondaryText font-normal">
              ({step} of {totalSteps})
            </span>
          )}
        </h2>
        {description && (
          <p className="text-secondaryText">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
