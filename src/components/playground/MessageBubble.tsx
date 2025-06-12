
import { Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DuckIcon } from '@/components/icons/DuckIcon';
import { ThinkingDuckAnimation } from './ThinkingDuckAnimation';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  type: 'user' | 'ai';
  content: string;
  isTyping?: boolean;
  onCopy?: (content: string) => void;
  onRetry?: () => void;
  isLastMessage?: boolean;
}

export function MessageBubble({ 
  type, 
  content, 
  isTyping = false, 
  onCopy, 
  onRetry,
  isLastMessage = false 
}: MessageBubbleProps) {
  const handleCopy = () => {
    if (onCopy) {
      onCopy(content);
    }
  };

  if (type === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] bg-primary text-primary-foreground rounded-lg px-4 py-2">
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex-shrink-0">
        {isTyping ? (
          <ThinkingDuckAnimation />
        ) : (
          <DuckIcon size={32} />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="bg-muted rounded-lg px-4 py-3">
          {isTyping && !content ? (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-sm">Thinking...</span>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
          )}
        </div>
        
        {!isTyping && content && (
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className={cn(
                "h-8 px-2 text-xs text-muted-foreground hover:text-foreground",
                "opacity-0 group-hover:opacity-100 transition-opacity"
              )}
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
            
            {isLastMessage && onRetry && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRetry}
                className={cn(
                  "h-8 px-2 text-xs text-muted-foreground hover:text-foreground",
                  "opacity-0 group-hover:opacity-100 transition-opacity"
                )}
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
