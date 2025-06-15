
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className={cn("relative", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          {step && totalSteps && (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-500 text-white text-sm font-medium">
              {step}
            </div>
          )}
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {title}
              {step && totalSteps && (
                <span className="text-sm text-muted-foreground font-normal">
                  ({step} of {totalSteps})
                </span>
              )}
            </CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
}
