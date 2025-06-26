
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface LibraryHeaderProps {
  isAuthenticated: boolean;
  onNewPrompt: () => void;
}

export function LibraryHeader({ isAuthenticated, onNewPrompt }: LibraryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 lg:mb-6 gap-3 lg:gap-4">
      <div className="space-y-1">
        <h1 className="text-xl lg:text-3xl font-bold">Prompt Library</h1>
        <p className="text-sm text-muted-foreground">
          {isAuthenticated ? 'Discover curated prompts and manage your collection' : 'Discover curated prompts and create your collection'}
        </p>
      </div>
      <Button 
        onClick={onNewPrompt}
        className="bg-gradient-to-r from-brand-500 to-blue-600 hover:from-brand-600 hover:to-blue-700 w-full sm:w-auto"
        size="sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Prompt
      </Button>
    </div>
  );
}
