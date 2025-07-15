import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
        {/* Editor window header */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">PromptDuck Editor</span>
        </div>
        
        {/* Interactive input area */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <span className="text-gray-500 dark:text-gray-400 font-mono text-sm absolute top-2 left-3 pointer-events-none">
              prompt:
            </span>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="font-mono text-sm pl-16 min-h-[80px] resize-none border-none bg-transparent focus:ring-0 focus:border-none"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Generate Prompt
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}