
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ModeType } from '@/types';
import { MODES, getAllModes } from '@/constants/modes';
import { cn } from '@/lib/utils';

interface ModeSelectorProps {
  selectedMode: ModeType;
  onModeChange: (mode: ModeType) => void;
  className?: string;
}

export function ModeSelector({ selectedMode, onModeChange, className }: ModeSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const modes = getAllModes();
  const currentMode = MODES[selectedMode];

  return (
    <Card className={cn("border-2", className)}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{currentMode.icon}</span>
            <div>
              <h3 className="font-semibold text-base">{currentMode.name} Mode</h3>
              <p className="text-sm text-secondaryText">{currentMode.description}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-secondaryText hover:text-primaryText"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {isExpanded && (
          <div className="space-y-3 pt-2 border-t border-[rgba(255,255,255,0.05)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {modes.map((mode) => (
                <Button
                  key={mode.id}
                  variant={selectedMode === mode.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => onModeChange(mode.id)}
                  className={cn(
                    "justify-start h-auto p-3 text-left",
                    selectedMode === mode.id && "ring-2 ring-accent"
                  )}
                >
                  <div className="flex items-start space-x-2 w-full">
                    <span className="text-lg flex-shrink-0">{mode.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm">{mode.name}</div>
                      <div className="text-xs opacity-80 line-clamp-2">{mode.description}</div>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {mode.targetPlatform}
                      </Badge>
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            <div className="bg-surface/50 rounded-lg p-3 text-sm">
              <h4 className="font-medium mb-2">Benefits of {currentMode.name} Mode:</h4>
              <ul className="space-y-1">
                {currentMode.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></span>
                    <span className="text-secondaryText">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
