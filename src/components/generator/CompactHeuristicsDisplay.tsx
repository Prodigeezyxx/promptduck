
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { HEURISTICS } from '@/constants';
import { HeuristicType } from '@/types';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CompactHeuristicsDisplayProps {
  selectedHeuristics: HeuristicType[];
}

export function CompactHeuristicsDisplay({ selectedHeuristics }: CompactHeuristicsDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (selectedHeuristics.length === 0) return null;

  return (
    <Card className="border-brand-200 bg-brand-50/30 dark:bg-brand-950/10">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-base">
            <Brain className="w-4 h-4 mr-2 text-brand-600" />
            Auto-Selected Heuristics ({selectedHeuristics.length})
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 px-2 text-brand-600 hover:text-brand-700"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Compact Summary */}
        <div className="flex flex-wrap gap-1 mb-2">
          {selectedHeuristics.slice(0, 3).map((heuristic) => (
            <Badge 
              key={heuristic} 
              variant="secondary" 
              className="text-xs bg-brand-100 text-brand-700 dark:bg-brand-900/30"
            >
              {HEURISTICS[heuristic].name}
            </Badge>
          ))}
          {selectedHeuristics.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{selectedHeuristics.length - 3} more
            </Badge>
          )}
        </div>

        {/* Expanded Details */}
        <div className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="space-y-2 pt-2 border-t border-brand-200/50">
            {selectedHeuristics.map((heuristic) => (
              <div key={heuristic} className="flex items-start space-x-2 p-2 bg-white/50 dark:bg-gray-900/20 rounded-md">
                <div className="w-1.5 h-1.5 bg-brand-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-brand-700 dark:text-brand-300">
                    {HEURISTICS[heuristic].name}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {HEURISTICS[heuristic].description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Summary */}
        {!isExpanded && (
          <p className="text-xs text-muted-foreground">
            Automatically selected based on your intent. 
            <button 
              onClick={() => setIsExpanded(true)}
              className="text-brand-600 hover:text-brand-700 ml-1 underline"
            >
              View details
            </button>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
