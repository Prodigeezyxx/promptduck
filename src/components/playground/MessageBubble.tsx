
import { Button } from '@/components/ui/button';
import { Copy, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';
import { DuckIcon } from '@/components/icons/DuckIcon';
import { ThinkingDuckAnimation } from './ThinkingDuckAnimation';

interface MessageBubbleProps {
  type: 'user' | 'ai';
  content: string;
  isTyping?: boolean;
  onCopy: () => void;
  enableTypingAnimation?: boolean;
}

export function MessageBubble({ 
  type, 
  content, 
  isTyping = false, 
  onCopy,
  enableTypingAnimation = false
}: MessageBubbleProps) {
  const isUser = type === 'user';
  const { displayedText, isTyping: isAnimating } = useTypingAnimation({
    text: content,
    isActive: enableTypingAnimation && !isUser && !isTyping
  });

  const finalContent = enableTypingAnimation && !isUser ? displayedText : content;
  const showTypingIndicator = isTyping || (enableTypingAnimation && isAnimating);

  if (showTypingIndicator && !finalContent) {
    return (
      <div 
        className="flex items-start space-x-3 w-full max-w-none mx-auto p-fluid-md chat-message-ai"
        role="status"
        aria-live="polite"
        aria-label="AI is thinking"
      >
        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg">
          <ThinkingDuckAnimation />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 bg-muted/50 rounded-lg px-3 py-2 backdrop-blur-sm" aria-hidden="true">
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            <span className="text-sm text-muted-foreground ml-2">Thinking...</span>
          </div>
          <span className="sr-only">AI is generating response</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "flex items-start space-x-3 w-full max-w-none mx-auto p-fluid-md group",
        isUser ? "chat-message-user" : "chat-message-ai"
      )}
      role="article"
      aria-label={`${isUser ? 'User' : 'AI'} message`}
    >
      <div className={cn(
        "flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105",
        isUser 
          ? "bg-gray-700 dark:bg-gray-800" 
          : "bg-gradient-to-br from-brand-500 to-brand-600"
      )}>
        {isUser ? (
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        ) : (
          <DuckIcon 
            size={24} 
            className="text-white drop-shadow-sm" 
          />
        )}
      </div>
      
      <div className="flex-1 min-w-0 space-y-2">
        <div 
          className="prose prose-sm max-w-none text-foreground dark:text-gray-200"
          aria-live={!isUser && isAnimating ? "polite" : "off"}
        >
          {finalContent.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 last:mb-0 leading-relaxed whitespace-pre-wrap text-fluid-base">
              {paragraph}
            </p>
          ))}
          {isAnimating && (
            <span className="inline-block w-2 h-4 bg-brand-500 animate-pulse ml-1" aria-hidden="true" />
          )}
        </div>
        
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCopy}
            className="h-8 px-2 text-muted-foreground hover:text-foreground touch-target text-fluid-xs"
            aria-label={`Copy ${isUser ? 'user' : 'AI'} message`}
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
}
