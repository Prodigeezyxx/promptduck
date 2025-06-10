
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ message, onRetry, className }: ErrorMessageProps) {
  return (
    <div 
      className={cn(
        "flex items-start space-x-3 max-w-4xl mx-auto px-4 py-6 bg-destructive/10 border border-destructive/20 rounded-lg",
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
        <AlertCircle className="w-4 h-4 text-destructive" />
      </div>
      
      <div className="flex-1 min-w-0 space-y-2">
        <div className="text-sm text-destructive">
          <p className="font-medium">Error generating response</p>
          <p className="text-destructive/80">{message}</p>
        </div>
        
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            className="h-8 text-xs border-destructive/20 hover:bg-destructive/10 min-h-[48px] touch-target"
            aria-label="Retry generating response"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
