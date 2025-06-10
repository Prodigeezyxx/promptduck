
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { ChatInput } from './ChatInput';
import { usePlaygroundConversation } from '@/hooks/usePlaygroundConversation';
import { useSmartPlaygroundSuggestions } from '@/hooks/useSmartPlaygroundSuggestions';
import { EmptyState } from './EmptyState';
import { MessagesList } from './MessagesList';
import { ReasoningProgressBar } from './ReasoningProgressBar';

export function ChatInterface() {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isLoading,
    currentInput,
    setCurrentInput,
    sendMessage,
    stopGeneration,
    clearConversation,
    copyMessage,
    isValidKey
  } = usePlaygroundConversation();

  const suggestions = useSmartPlaygroundSuggestions();

  const handleSuggestionClick = (content: string) => {
    setCurrentInput(content);
  };

  const handleRetryLastMessage = () => {
    const lastUserMessage = messages.filter(m => m.type === 'user').pop();
    if (lastUserMessage) {
      sendMessage(lastUserMessage.content);
    }
  };

  return (
    <div className="flex flex-col h-full dark:bg-gray-950">
      {/* Reasoning Progress Bar */}
      <ReasoningProgressBar isActive={isLoading} />

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto chat-scrollbar"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0 ? (
          <EmptyState 
            suggestions={suggestions} 
            onSuggestionClick={handleSuggestionClick} 
          />
        ) : (
          <MessagesList
            messages={messages}
            copyMessage={copyMessage}
            onRetryLastMessage={handleRetryLastMessage}
          />
        )}
      </div>

      {/* Clear Conversation Button */}
      {messages.length > 0 && (
        <div className="flex justify-center py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearConversation}
            className="text-muted-foreground hover:text-foreground min-h-[48px] touch-target"
            aria-label="Clear conversation"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear conversation
          </Button>
        </div>
      )}

      {/* Input Area */}
      <ChatInput
        value={currentInput}
        onChange={setCurrentInput}
        onSend={sendMessage}
        onStop={stopGeneration}
        disabled={false}
        isLoading={isLoading}
      />
    </div>
  );
}
