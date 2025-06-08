
import { useCreditStore } from '@/store/creditStore';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function CreditDisplay() {
  const { getRemainingCredits, credits } = useCreditStore();
  const remaining = getRemainingCredits();
  const percentage = (remaining / credits.daily_limit) * 100;

  return (
    <Card className="p-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Daily Credits</span>
          <span className="text-sm text-muted-foreground">
            {remaining}/{credits.daily_limit}
          </span>
        </div>
        <Progress value={percentage} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {remaining > 0 ? `${remaining} generations left` : 'Credits reset daily'}
        </p>
      </div>
    </Card>
  );
}
