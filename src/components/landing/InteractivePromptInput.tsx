import { useState } from 'react';
import { PromptBox } from '@/components/ui/chatgpt-prompt-input';
import { cn } from '@/lib/utils';

interface InteractivePromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function InteractivePromptInput({ 
  onSubmit, 
  isLoading = false, 
  placeholder = "Describe what you want to create...",
  className 
}: InteractivePromptInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSubmit(prompt.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={cn("max-w-2xl mx-auto mt-8 lg:mt-12", className)}>
      <form onSubmit={handleSubmit}>
        <PromptBox
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
        />
      </form>
    </div>
  );
}