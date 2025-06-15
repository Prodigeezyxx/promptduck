
import { cn } from '@/lib/utils';

interface CharacterCounterProps {
  current: number;
  max?: number;
  className?: string;
}

export function CharacterCounter({ current, max, className }: CharacterCounterProps) {
  if (!max) return null;

  const percentage = (current / max) * 100;
  const isNearLimit = percentage > 80;
  const isOverLimit = current > max;

  return (
    <div className={cn("flex items-center justify-between text-xs text-muted-foreground", className)}>
      <div className={cn(
        "transition-colors",
        isOverLimit ? "text-destructive" : isNearLimit ? "text-warning" : "text-muted-foreground"
      )}>
        {current}/{max} characters
      </div>
      <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-300",
            isOverLimit ? "bg-destructive" : isNearLimit ? "bg-warning" : "bg-brand-500"
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
