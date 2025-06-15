
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
  className
}: FormSectionProps) {
  return (
    <div className={cn(
      "rounded-lg bg-surface py-3 px-4 sm:px-6 space-y-5 drop-shadow-sm border border-border",
      className
    )}>
      <div className="space-y-1">
        <h2 className="text-lg sm:text-lg font-semibold text-primaryText">{title}</h2>
        {description && (
          <p className="text-sm text-secondaryText">{description}</p>
        )}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}
