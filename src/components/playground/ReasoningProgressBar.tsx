
import { cn } from '@/lib/utils';

interface ReasoningProgressBarProps {
  isActive: boolean;
}

export function ReasoningProgressBar({ isActive }: ReasoningProgressBarProps) {
  if (!isActive) return null;

  return (
    <div className="flex items-center justify-center py-4 bg-background/50">
      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <span>AI is thinking...</span>
      </div>
    </div>
  );
}
