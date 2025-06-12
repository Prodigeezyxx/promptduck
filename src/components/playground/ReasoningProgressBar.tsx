
import { cn } from '@/lib/utils';

interface ReasoningProgressBarProps {
  isActive: boolean;
}

export function ReasoningProgressBar({ isActive }: ReasoningProgressBarProps) {
  if (!isActive) return null;

  return (
    <div className="flex items-center justify-center py-2 bg-background/50">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <div className="relative">
          <div 
            className={cn(
              "w-2 h-2 bg-yellow-500 rounded-full",
              "animate-pulse"
            )}
          />
        </div>
        <span>Thinking...</span>
      </div>
    </div>
  );
}
