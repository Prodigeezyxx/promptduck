
import { useCreditStore } from '@/store/creditStore';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';

export function CreditDisplay() {
  const { getRemainingCredits, credits } = useCreditStore();
  const remaining = getRemainingCredits();
  const percentage = (remaining / credits.daily_limit) * 100;

  return (
    <Card className="p-2 lg:p-3">
      <div className="space-y-1 lg:space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs lg:text-sm font-medium">Daily Credits</span>
          <span className="text-xs text-muted-foreground">
            {remaining}/{credits.daily_limit}
          </span>
        </div>
        <Progress value={percentage} className="h-1 lg:h-2" />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {remaining > 0 ? `${remaining} left` : 'Resets daily'}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-6 px-2 text-xs lg:hidden border-brand-500/20 text-brand-600 hover:bg-brand-50"
          >
            <Crown className="w-3 h-3 mr-1" />
            Pro
          </Button>
        </div>
        {/* Desktop Get Pro button */}
        <div className="hidden lg:block">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs border-brand-500/20 text-brand-600 hover:bg-brand-50"
          >
            <Crown className="w-3 h-3 mr-1" />
            Get Pro
          </Button>
        </div>
      </div>
    </Card>
  );
}
