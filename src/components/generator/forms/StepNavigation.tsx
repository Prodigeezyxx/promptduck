
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  canProceed: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function StepNavigation({ 
  currentStep, 
  canProceed, 
  onPrevious, 
  onNext 
}: StepNavigationProps) {
  return (
    <div className="flex justify-between pt-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="min-h-[44px]"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Previous
      </Button>
      
      {currentStep < 3 && (
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="min-h-[44px]"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
}
