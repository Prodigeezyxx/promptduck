
import { Button } from '@/components/ui/button';
import { Copy, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  type: 'user' | 'ai';
  content: string;
  isTyping?: boolean;
  onCopy: () => void;
}

export function MessageBubble({ type, content, isTyping = false, onCopy }: MessageBubbleProps) {
  const isUser = type === 'user';

  if (isTyping) {
    return (
      <div className="flex items-start space-x-3 max-w-4xl mx-auto px-4 py-6">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-start space-x-3 max-w-4xl mx-auto px-4 py-6 group",
      isUser ? "bg-transparent" : "bg-muted/30"
    )}>
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isUser ? "bg-gray-700" : "bg-brand-500"
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      
      <div className="flex-1 min-w-0 space-y-2">
        <div className="prose prose-sm max-w-none text-foreground">
          {content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 last:mb-0 leading-relaxed whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </div>
        
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCopy}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
}
