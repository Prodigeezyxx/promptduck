
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw, Sparkles, History, BookOpen, Zap } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { usePlaygroundConversation } from '@/hooks/usePlaygroundConversation';
import { useSmartPlaygroundSuggestions } from '@/hooks/useSmartPlaygroundSuggestions';
import { cn } from '@/lib/utils';

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

  const suggestions = useSmartPlaygroundSuggestions();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSuggestionClick = (content: string) => {
    setCurrentInput(content);
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'recent': return <History className="w-3 h-3" />;
      case 'remix': return <Sparkles className="w-3 h-3" />;
      case 'library': return <BookOpen className="w-3 h-3" />;
      case 'refined': return <Zap className="w-3 h-3" />;
      default: return <Zap className="w-3 h-3" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'recent': return 'text-brand-500 bg-brand-50 dark:bg-brand-900/20';
      case 'remix': return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'library': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'refined': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

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
              <h2 className="text-2xl font-semibold mb-2">Test your prompts here</h2>
              <p className="text-muted-foreground mb-8">
                Start a conversation with your generated prompts or try something new.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {suggestions.map((suggestion) => (
                  <div 
                    key={suggestion.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                    onClick={() => handleSuggestionClick(suggestion.content)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-left group-hover:text-brand-600 transition-colors">
                        {suggestion.title}
                      </p>
                      <div className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-full text-xs shrink-0 ml-2",
                        getSourceColor(suggestion.source)
                      )}>
                        {getSourceIcon(suggestion.source)}
                        <span className="capitalize">{suggestion.source}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-left">
                      {suggestion.description}
                    </p>
                    {suggestion.metadata?.heuristics && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {suggestion.metadata.heuristics.slice(0, 2).map((heuristic) => (
                          <span key={heuristic} className="text-xs px-2 py-1 bg-accent rounded-md">
                            {heuristic}
                          </span>
                        ))}
                        {suggestion.metadata.heuristics.length > 2 && (
                          <span className="text-xs px-2 py-1 bg-accent rounded-md">
                            +{suggestion.metadata.heuristics.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
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
