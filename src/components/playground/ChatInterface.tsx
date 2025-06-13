
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, History, X } from 'lucide-react';
import { ChatInput } from './ChatInput';
import { usePlaygroundConversation } from '@/hooks/usePlaygroundConversation';
import { useSmartPlaygroundSuggestions } from '@/hooks/useSmartPlaygroundSuggestions';
import { EmptyState } from './EmptyState';
import { MessagesList } from './MessagesList';
import { ReasoningProgressBar } from './ReasoningProgressBar';
import { ConversationHistory } from './ConversationHistory';

export function ChatInterface() {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showHistory, setShowHistory] = useState(false);
  
  const {
    messages,
    isLoading,
    currentInput,
    setCurrentInput,
    sendMessage,
    stopGeneration,
    clearConversation,
    copyMessage,
    isValidKey,
    conversations,
    currentConversationId,
    loadConversationById,
    deleteConversation
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

  const handleNewConversation = () => {
    clearConversation();
    setShowHistory(false);
  };

  const handleLoadConversation = (id: string) => {
    loadConversationById(id);
    setShowHistory(false);
  };

  return (
    <div className="flex h-full bg-background">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
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

        {/* Action Buttons */}
        {messages.length > 0 && (
          <div className="flex justify-center gap-2 py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearConversation}
              className="text-secondaryText hover:text-primaryText min-h-[48px] touch-target"
              aria-label="Start new conversation"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New conversation
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="text-secondaryText hover:text-primaryText min-h-[48px] touch-target"
              aria-label="Toggle conversation history"
            >
              {showHistory ? <X className="w-4 h-4 mr-2" /> : <History className="w-4 h-4 mr-2" />}
              {showHistory ? 'Close' : 'History'}
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

      {/* Conversation History Sidebar */}
      {showHistory && (
        <ConversationHistory
          conversations={conversations}
          currentConversationId={currentConversationId}
          onLoadConversation={handleLoadConversation}
          onDeleteConversation={deleteConversation}
          onNewConversation={handleNewConversation}
        />
      )}
    </div>
  );
}
