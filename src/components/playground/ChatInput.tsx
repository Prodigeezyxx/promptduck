
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  disabled = false,
  placeholder = "Message PromptDuck..."
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSend(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [value]);

  return (
    <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-4xl mx-auto p-4">
        <div className={cn(
          "relative flex items-end space-x-2 rounded-2xl border bg-background shadow-sm",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all",
          disabled && "opacity-50"
        )}>
          {/* Attachment button */}
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            className="h-10 w-10 rounded-xl flex-shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          {/* Textarea */}
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "flex-1 min-h-[40px] max-h-[200px] resize-none border-0 bg-transparent px-0 py-3",
              "focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
            )}
            rows={1}
          />

          {/* Voice input button */}
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            className="h-10 w-10 rounded-xl flex-shrink-0"
          >
            <Mic className="w-4 h-4" />
          </Button>

          {/* Send button */}
          <Button
            onClick={handleSubmit}
            disabled={disabled || !value.trim()}
            size="sm"
            className={cn(
              "h-10 w-10 rounded-xl flex-shrink-0",
              value.trim() && !disabled 
                ? "bg-brand-500 hover:bg-brand-600 text-white" 
                : "bg-muted text-muted-foreground"
            )}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          PromptDuck can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
