
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, X } from 'lucide-react';
import { toast } from 'sonner';

interface FullscreenPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  title?: string;
}

export function FullscreenPromptModal({ 
  open, 
  onOpenChange, 
  content, 
  title = "Generated Prompt" 
}: FullscreenPromptModalProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success('Prompt copied to clipboard');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto bg-muted/30 rounded-lg p-4 min-h-0">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {content}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
