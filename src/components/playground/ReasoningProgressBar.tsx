
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface ReasoningProgressBarProps {
  isActive: boolean;
  onComplete?: () => void;
}

export function ReasoningProgressBar({ isActive, onComplete }: ReasoningProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');

  const stages = [
    'Analyzing prompt...',
    'Processing context...',
    'Generating response...',
    'Optimizing output...',
    'Finalizing...'
  ];

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      setCurrentStage('');
      return;
    }

    let currentProgress = 0;
    let stageIndex = 0;
    setCurrentStage(stages[0]);

    const timer = setInterval(() => {
      currentProgress += Math.random() * 8 + 2; // Random increment between 2-10
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setCurrentStage('Complete');
        clearInterval(timer);
        setTimeout(() => {
          onComplete?.();
        }, 500);
        return;
      }

      setProgress(currentProgress);

      // Update stage based on progress
      const newStageIndex = Math.floor((currentProgress / 100) * stages.length);
      if (newStageIndex !== stageIndex && newStageIndex < stages.length) {
        stageIndex = newStageIndex;
        setCurrentStage(stages[stageIndex]);
      }
    }, 150);

    return () => clearInterval(timer);
  }, [isActive, onComplete]);

  if (!isActive && progress === 0) return null;

  return (
    <div className="px-4 py-3 bg-muted/50 border-b">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {currentStage}
              </span>
              <span className="text-xs text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
