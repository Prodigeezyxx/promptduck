
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
      case 'recent': return 'text-brand-500 bg-brand-50 dark:bg-brand-900/20';
      case 'remix': return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'library': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'refined': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <button 
      key={suggestion.id}
      className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group text-left min-h-[48px] touch-target"
      onClick={() => onSuggestionClick(suggestion.content)}
      aria-label={`Use suggestion: ${suggestion.title}`}
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
    </button>
  );
}
