
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
        <div className="chat-input-wrapper flex items-end gap-2 p-fluid-sm surface-style rounded-xl focus-within:ring-2 focus-within:ring-accent">
          {/* Textarea */}
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className={cn(
              "flex-1 resize-none border-0 bg-transparent px-0 py-3 text-fluid-base text-primaryText",
              "focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-secondaryText",
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
                ? "bg-warning hover:bg-warning/90 text-white"
                : value.trim() && !disabled
                ? "bg-accent hover:bg-accent/90 text-white" 
                : "bg-input text-secondaryText"
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
        
        <p className="text-fluid-xs text-secondaryText mt-2 text-center">
          PromptDuck can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
