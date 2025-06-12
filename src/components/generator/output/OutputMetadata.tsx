
import { GenerationResult } from '@/types';

interface OutputMetadataProps {
  result: GenerationResult;
}

export function OutputMetadata({ result }: OutputMetadataProps) {
  return (
    <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
      <div className="flex justify-between">
        <span>Estimated tokens:</span>
        <span>{result.metadata.estimated_tokens}</span>
      </div>
      <div className="flex justify-between">
        <span>Confidence:</span>
        <span>{Math.round(result.metadata.confidence_score * 100)}%</span>
      </div>
      <div className="flex justify-between">
        <span>Generation time:</span>
        <span>{result.metadata.generation_time_ms}ms</span>
      </div>
    </div>
  );
}
