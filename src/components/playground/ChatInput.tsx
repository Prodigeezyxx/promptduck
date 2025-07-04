
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

  // Enhanced auto-resize with better mobile handling
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      // Better responsive max height with improved mobile experience
      const isMobile = window.innerWidth < 768;
      const maxHeight = isMobile ? 100 : 150; // Reduced max heights
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = newHeight + 'px';
      
      // Improved scrolling behavior
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [value]);

  return (
    <div className="chat-input-container mobile-safe-bottom">
      <div className="w-full max-w-none mx-auto p-fluid-md">
        <div className="chat-input-wrapper flex items-end gap-3 p-fluid-sm surface-style rounded-xl focus-within:ring-2 focus-within:ring-accent shadow-sm">
          {/* Enhanced Textarea with better scroll handling */}
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
              "min-h-[48px] max-h-[100px] sm:max-h-[150px]", // Reduced max heights
              "mobile-scroll mobile-text scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
            )}
            rows={1}
            aria-label="Message input"
            style={{ 
              fontSize: '16px', // Prevents zoom on iOS
              lineHeight: '1.5'
            }}
          />

          {/* Enhanced Send/Stop button */}
          <Button
            onClick={isLoading ? handleStop : handleSubmit}
            disabled={disabled || (!value.trim() && !isLoading)}
            size="icon"
            className={cn(
              "h-12 w-12 rounded-xl flex-shrink-0 touch-target-large",
              isLoading
                ? "bg-warning hover:bg-warning/90 text-white"
                : value.trim() && !disabled
                ? "bg-accent hover:bg-accent/90 text-white shadow-sm" 
                : "bg-input text-secondaryText"
            )}
            aria-label={isLoading ? "Stop generation" : "Send message"}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        
        <p className="text-fluid-xs text-secondaryText mt-3 text-center mobile-text">
          PromptDuck can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
