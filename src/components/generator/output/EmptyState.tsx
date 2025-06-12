
import { Sparkles } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
        <Sparkles className="w-6 h-6 text-muted-foreground" />
      </div>
      <div>
        <h3 className="font-medium mb-2">Ready to generate</h3>
        <p className="text-sm text-muted-foreground">
          Your optimized prompt will appear here
        </p>
      </div>
    </div>
  );
}
