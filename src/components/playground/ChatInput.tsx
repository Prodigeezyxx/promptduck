
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  onStop?: () => void;
  disabled?: boolean;
  placeholder?: string;
  isLoading?: boolean;
}

export function ChatInput({ 
  value, 
  onChange, 
  onSend,
  onStop,
  disabled = false,
  placeholder = "Message PromptDuck...",
  isLoading = false
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (value.trim() && !disabled && !isLoading) {
      onSend(value);
    }
  };

  const handleStop = () => {
    if (onStop) {
      onStop();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea with responsive max height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      // Responsive max height based on viewport
      const maxHeight = window.innerWidth < 768 ? 150 : 200;
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
    }
  }, [value]);

  return (
    <div className="chat-input-container">
      <div className="w-full max-w-none mx-auto p-fluid-md">
        <div className="chat-input-wrapper flex items-end gap-2 p-fluid-sm border border-input rounded-xl bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          {/* Textarea */}
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className={cn(
              "flex-1 resize-none border-0 bg-transparent px-0 py-3 text-fluid-base",
              "focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground",
              "min-h-[40px] max-h-[150px] sm:max-h-[200px]"
            )}
            rows={1}
            aria-label="Message input"
          />

          {/* Send/Stop button */}
          <Button
            onClick={isLoading ? handleStop : handleSubmit}
            disabled={disabled || (!value.trim() && !isLoading)}
            size="sm"
            className={cn(
              "h-10 w-10 rounded-xl flex-shrink-0 touch-target",
              isLoading
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                : value.trim() && !disabled
                ? "bg-brand-500 hover:bg-brand-600 text-white" 
                : "bg-muted text-muted-foreground dark:bg-gray-800"
            )}
            aria-label={isLoading ? "Stop generation" : "Send message"}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <p className="text-fluid-xs text-muted-foreground mt-2 text-center">
          PromptDuck can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
