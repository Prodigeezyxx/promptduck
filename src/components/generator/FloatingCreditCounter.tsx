
import { useCreditStore } from '@/store/creditStore';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

export function FloatingCreditCounter() {
  const { getRemainingCredits } = useCreditStore();
  const credits = getRemainingCredits();

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge variant="secondary" className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-background/95 backdrop-blur-sm border shadow-lg">
        <Zap className="w-4 h-4 text-accent" />
        {credits} credits left
      </Badge>
    </div>
  );
}
