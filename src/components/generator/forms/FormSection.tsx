
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
  totalSteps,
}: FormSectionProps) {
  // Main modern card container with larger padding and softer surface styling
  return (
    <section
      className={cn(
        "rounded-2xl bg-surface shadow-elevation-2 p-6 sm:p-8 space-y-6 transition-colors",
        className
      )}
    >
      <div className="flex items-center gap-4">
        {step && totalSteps && (
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-500 text-white text-base font-bold mr-2 shadow-md">
            {step}
          </span>
        )}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-3">
            {title}
            {step && totalSteps && (
              <span className="text-base text-muted-foreground font-normal ml-2">
                ({step} of {totalSteps})
              </span>
            )}
          </h2>
          {description && (
            <div className="mt-1 text-sm text-muted-foreground">{description}</div>
          )}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
