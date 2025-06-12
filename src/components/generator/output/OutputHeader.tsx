
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { GenerationResult } from '@/types';

interface OutputHeaderProps {
  result: GenerationResult;
}

export function OutputHeader({ result }: OutputHeaderProps) {
  return (
    <>
      <div className="text-lg flex items-center">
        <Sparkles className="w-5 h-5 mr-2 text-brand-500" />
        {result.preview_title}
      </div>
      <div className="flex flex-wrap gap-1">
        {result.tags.slice(0, 4).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
        {result.tags.length > 4 && (
          <Badge variant="outline" className="text-xs">
            +{result.tags.length - 4} more
          </Badge>
        )}
      </div>
    </>
  );
}
