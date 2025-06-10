
import { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { ErrorMessage } from './ErrorMessage';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface MessagesListProps {
  messages: Message[];
  copyMessage: (content: string) => void;
  onRetryLastMessage: () => void;
}

export function MessagesList({ messages, copyMessage, onRetryLastMessage }: MessagesListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive or when typing animation updates
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      }
    };

    // Scroll immediately for new messages
    scrollToBottom();

    // Also scroll during typing animations with a slight delay
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <div className="space-y-0">
      {messages.map((message, index) => {
        const isLastAiMessage = message.type === 'ai' && index === messages.length - 1;
        const enableTyping = isLastAiMessage && !message.isTyping;
        
        if (message.type === 'ai' && message.content.startsWith('Error:')) {
          return (
            <ErrorMessage
              key={message.id}
              message={message.content.replace('Error: ', '')}
              onRetry={onRetryLastMessage}
            />
          );
        }
        
        return (
          <MessageBubble
            key={message.id}
            type={message.type}
            content={message.content}
            isTyping={message.isTyping}
            onCopy={() => copyMessage(message.content)}
            enableTypingAnimation={enableTyping}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
