
import { MessageBubble } from './MessageBubble';

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
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      {messages.map((message, index) => (
        <div key={message.id} className="group">
          <MessageBubble
            type={message.type}
            content={message.content}
            isTyping={message.isTyping}
            onCopy={copyMessage}
            onRetry={message.type === 'ai' && index === messages.length - 1 ? onRetryLastMessage : undefined}
            isLastMessage={index === messages.length - 1}
          />
        </div>
      ))}
    </div>
  );
}
