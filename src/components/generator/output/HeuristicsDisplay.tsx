
import { GenerationResult } from '@/types';

interface HeuristicsDisplayProps {
  result: GenerationResult;
}

export function HeuristicsDisplay({ result }: HeuristicsDisplayProps) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">
        Applied Heuristics ({result.heuristics.length})
      </label>
      <div className="flex flex-wrap gap-1">
        {result.heuristics.map((heuristic) => (
          <span 
            key={heuristic} 
            className="heuristic-tag text-xs px-2 py-1 bg-accent rounded-md"
          >
            {heuristic}
          </span>
        ))}
      </div>
    </div>
  );
}
