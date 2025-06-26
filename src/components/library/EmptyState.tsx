
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  isAuthenticated: boolean;
  hasFeaturedPrompt: boolean;
  onNewPrompt: () => void;
}

export function EmptyState({ isAuthenticated, hasFeaturedPrompt, onNewPrompt }: EmptyStateProps) {
  return (
    <div className="text-center py-12 lg:py-16 border-2 border-dashed border-border rounded-lg">
      <div className="max-w-md mx-auto">
        <h3 className="text-lg font-semibold mb-2">No saved prompts yet</h3>
        <p className="text-muted-foreground mb-6">
          {isAuthenticated 
            ? 'Start creating and saving your own prompts to build your personal library.'
            : 'Start creating prompts now. Sign in to save them to your personal library.'
          }
          {hasFeaturedPrompt && ' You can also try the featured template above to get started.'}
        </p>
        <Button onClick={onNewPrompt} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Create your first prompt
        </Button>
      </div>
    </div>
  );
}
