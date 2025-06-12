
import { SuggestionCard } from './SuggestionCard';
import { DuckIcon } from '@/components/icons/DuckIcon';

interface EmptyStateProps {
  suggestions: Array<{
    id: string;
    title: string;
    description: string;
    content: string;
    source: string;
    metadata?: {
      heuristics?: string[];
    };
  }>;
  onSuggestionClick: (content: string) => void;
}

export function EmptyState({ suggestions, onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-2xl space-y-8">
        {/* Enhanced PromptDuck Logo with Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/20 to-brand-600/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-brand-500 to-brand-600 p-6 rounded-full shadow-2xl transition-transform hover:scale-105 duration-300">
              <DuckIcon 
                size={48} 
                className="text-white drop-shadow-lg" 
              />
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="space-y-4">
          <h2 className="text-2xl lg:text-3xl font-bold gradient-text">
            Welcome to the Prompt Playground
          </h2>
          <p className="text-muted-foreground text-lg">
            Test and experiment with prompts using Advanced AI. Start a conversation below or try one of these suggestions.
          </p>
        </div>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onSuggestionClick={onSuggestionClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
