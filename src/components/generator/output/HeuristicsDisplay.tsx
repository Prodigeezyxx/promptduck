
import { GenerationResult } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface HeuristicsDisplayProps {
  result: GenerationResult;
}

const heuristicDescriptions: Record<string, string> = {
  'Clear Structure': 'Organized your prompt with clear sections and logical flow',
  'Specific Context': 'Added relevant context to improve response accuracy',
  'Action-Oriented': 'Focused on specific actions and outcomes',
  'Constraint Setting': 'Defined boundaries and limitations for better results',
  'Example Inclusion': 'Provided examples to guide the AI response',
  'Persona Definition': 'Established a clear role or perspective for the AI',
  'Output Format': 'Specified the desired format and structure of the response',
  'Iterative Refinement': 'Refined the prompt through multiple enhancement steps'
};

export function HeuristicsDisplay({ result }: HeuristicsDisplayProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <label className="text-sm font-semibold">
          Enhancement Strategies Applied ({result.heuristics.length})
        </label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                These are the specific techniques used to enhance your prompt for better AI responses
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {result.heuristics.map((heuristic) => (
          <TooltipProvider key={heuristic}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant="secondary" 
                  className="text-xs px-3 py-1 cursor-help hover:bg-accent/20 transition-colors"
                >
                  {heuristic}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  {heuristicDescriptions[heuristic] || `Applied ${heuristic} enhancement strategy`}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        Hover over strategies to see how they improved your prompt
      </p>
    </div>
  );
}
