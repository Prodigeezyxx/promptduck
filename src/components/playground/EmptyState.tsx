
import { SuggestionCard } from './SuggestionCard';

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
    <div className="flex items-center justify-center h-full p-4 md:p-6">
      <div className="text-center max-w-3xl w-full">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">Test your prompts here</h2>
        <p className="text-muted-foreground mb-6 md:mb-8">
          Start a conversation with your generated prompts or try something new.
        </p>
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
