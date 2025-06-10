
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { usePlaygroundConversation } from '@/hooks/usePlaygroundConversation';

export function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isLoading,
    currentInput,
    setCurrentInput,
    sendMessage,
    clearConversation,
    copyMessage,
    isValidKey
  } = usePlaygroundConversation();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* API Key Warning */}
      {!isValidKey && (
        <div className="mx-4 mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              API key required. Please configure your Gemini API key in Settings to test prompts.
            </p>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full px-4">
            <div className="text-center max-w-2xl">
              <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
              <p className="text-muted-foreground mb-8">
                Start a conversation by typing your prompt below. I'll help you test and refine your ideas.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <p className="font-medium">Write a marketing email</p>
                  <p className="text-muted-foreground">for a new product launch</p>
                </div>
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <p className="font-medium">Create a story outline</p>
                  <p className="text-muted-foreground">for a sci-fi adventure</p>
                </div>
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <p className="font-medium">Generate code comments</p>
                  <p className="text-muted-foreground">for better documentation</p>
                </div>
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <p className="font-medium">Plan a workout routine</p>
                  <p className="text-muted-foreground">for beginners</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                type={message.type}
                content={message.content}
                isTyping={message.isTyping}
                onCopy={() => copyMessage(message.content)}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Clear Conversation Button */}
      {messages.length > 0 && (
        <div className="flex justify-center py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearConversation}
            className="text-muted-foreground hover:text-foreground"
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
        disabled={isLoading || !isValidKey}
      />
    </div>
  );
}
