
import { History, BookOpen, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuggestionCardProps {
  suggestion: {
    id: string;
    title: string;
    description: string;
    content: string;
    source: string;
    metadata?: {
      heuristics?: string[];
    };
  };
  onSuggestionClick: (content: string) => void;
}

export function SuggestionCard({ suggestion, onSuggestionClick }: SuggestionCardProps) {
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
      case 'recent': return 'text-accent bg-accent/10';
      case 'remix': return 'text-purple-400 bg-purple-400/10';
      case 'library': return 'text-blue-400 bg-blue-400/10';
      case 'refined': return 'text-green-400 bg-green-400/10';
      default: return 'text-secondaryText bg-surface';
    }
  };

  return (
    <button 
      key={suggestion.id}
      className="surface-style text-left min-h-[48px] touch-target p-4 group hover:bg-input transition-colors rounded-lg"
      onClick={() => onSuggestionClick(suggestion.content)}
      aria-label={`Use suggestion: ${suggestion.title}`}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="font-medium text-left text-primaryText group-hover:text-accent transition-colors">
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
      <p className="text-secondaryText text-left text-sm mb-3">
        {suggestion.description}
      </p>
      {suggestion.metadata?.heuristics && (
        <div className="flex flex-wrap gap-2 mt-2">
          {suggestion.metadata.heuristics.slice(0, 2).map((heuristic) => (
            <span key={heuristic} className="text-xs px-2.5 py-1 bg-input rounded-md text-secondaryText">
              {heuristic}
            </span>
          ))}
          {suggestion.metadata.heuristics.length > 2 && (
            <span className="text-xs px-2.5 py-1 bg-input rounded-md text-secondaryText">
              +{suggestion.metadata.heuristics.length - 2}
            </span>
          )}
        </div>
      )}
    </button>
  );
}
