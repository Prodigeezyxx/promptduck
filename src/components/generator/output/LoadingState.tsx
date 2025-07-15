
import { OptimisticLoadingState } from './OptimisticLoadingState';
import { ModeType } from '@/types';

interface LoadingStateProps {
  intent?: string;
  context?: string;
  mode?: ModeType;
}

export function LoadingState({ intent = '', context = '', mode = 'general' }: LoadingStateProps) {
  // If we have intent data, show optimistic loading
  if (intent.trim()) {
    return (
      <OptimisticLoadingState 
        intent={intent} 
        context={context} 
        mode={mode} 
      />
    );
  }

  // Fallback to simple loading state
  return (
    <div className="text-center space-y-4 py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
      <p className="text-sm text-secondaryText">
        Enhancing your prompt...
      </p>
    </div>
  );
}
