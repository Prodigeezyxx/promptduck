
import { cn } from '@/lib/utils';

interface CharacterCounterProps {
  current: number;
  max?: number;
  className?: string;
}

export function CharacterCounter({ current, max, className }: CharacterCounterProps) {
  if (!max) return null;
  const percentage = (current / max) * 100;
  const isNearLimit = percentage > 85;
  const isOverLimit = current > max;

  return (
    <div className={cn("flex items-center justify-between text-[11px] leading-tight", className)}>
      <div className={cn(
        "text-secondaryText",
        isNearLimit && "text-warning",
        isOverLimit && "text-destructive"
      )}>
        {current}/{max}
      </div>
      <div className="w-14 h-1 bg-input rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-300",
            percentage <= 85 ? "bg-brand-500" : percentage <= 100 ? "bg-warning" : "bg-destructive"
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
