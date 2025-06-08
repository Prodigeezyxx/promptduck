
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { HEURISTICS } from '@/constants';
import { HeuristicType } from '@/types';

interface HeuristicsDisplayProps {
  selectedHeuristics: HeuristicType[];
}

export function HeuristicsDisplay({ selectedHeuristics }: HeuristicsDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          Auto-Selected Heuristics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {selectedHeuristics.map((heuristic) => (
            <div key={heuristic} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-brand-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">
                  {HEURISTICS[heuristic].name}
                </div>
                <p className="text-xs text-muted-foreground">
                  {HEURISTICS[heuristic].description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          These heuristics were automatically selected based on your intent and context.
        </p>
      </CardContent>
    </Card>
  );
}
