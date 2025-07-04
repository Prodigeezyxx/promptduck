
import { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuggestionItemProps {
  suggestion: string;
  onRemix: (suggestion: string) => void;
}

const SuggestionItem = ({ suggestion, onRemix }: SuggestionItemProps) => (
  <div className="p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 hover:border-brand-300">
    <div className="flex items-start justify-between gap-3">
      <p className="text-sm leading-relaxed break-words flex-1">{suggestion}</p>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemix(suggestion)}
        className="shrink-0 h-8 w-8"
      >
        <RefreshCw className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

interface VirtualizedSuggestionsProps {
  suggestions: string[];
  onRemixSuggestion: (suggestion: string) => void;
  maxHeight?: number;
}

export function VirtualizedSuggestions({
  suggestions,
  onRemixSuggestion,
  maxHeight = 200
}: VirtualizedSuggestionsProps) {
  const itemHeight = 80; // Approximate height per suggestion item
  
  const visibleItems = useMemo(() => {
    return Math.min(suggestions.length, Math.floor(maxHeight / itemHeight));
  }, [suggestions.length, maxHeight]);

  if (suggestions.length === 0) {
    return null;
  }

  // For small lists, render directly without virtualization
  if (suggestions.length <= 3) {
    return (
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <SuggestionItem
            key={index}
            suggestion={suggestion}
            onRemix={onRemixSuggestion}
          />
        ))}
      </div>
    );
  }

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style} className="px-1">
      <div className="pb-2">
        <SuggestionItem
          suggestion={suggestions[index]}
          onRemix={onRemixSuggestion}
        />
      </div>
    </div>
  );

  return (
    <div className="border rounded-lg">
      <List
        height={Math.min(maxHeight, suggestions.length * itemHeight)}
        itemCount={suggestions.length}
        itemSize={itemHeight}
        className="scrollbar-thin"
      >
        {Row}
      </List>
    </div>
  );
}
