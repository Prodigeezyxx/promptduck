
import { Button } from '@/components/ui/button';
import { Copy, Save, PlayCircle, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GenerationResult } from '@/types';
import { downloadPromptAsJSON } from '@/utils/promptExporter';
import { useToast } from '@/hooks/use-toast';

interface OutputActionsProps {
  result: GenerationResult;
  onCopyPrompt: () => void;
  onSavePrompt: () => void;
}

export function OutputActions({ result, onCopyPrompt, onSavePrompt }: OutputActionsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTestInPlayground = () => {
    navigate('/app/playground', { 
      state: { prefilledPrompt: result.optimized_prompt }
    });
  };

  const handleDownloadJSON = () => {
    const tempPrompt = {
      id: 'temp-' + Date.now(),
      title: result.preview_title,
      content: result.optimized_prompt,
      description: result.preview_title,
      tags: result.tags,
      persona: 'creator' as const,
      heuristics: result.heuristics,
      variables: result.variables,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: 1,
      usage_count: 0,
      category: 'general' as const,
      difficulty: 'intermediate' as const,
      estimatedTime: '15 minutes'
    };
    
    downloadPromptAsJSON(tempPrompt);
    toast({
      title: "Download started",
      description: "Your prompt has been downloaded as a JSON file."
    });
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        onClick={handleTestInPlayground}
        className="bg-brand-500 hover:bg-brand-600 text-white flex-1 sm:flex-none"
      >
        <PlayCircle className="w-4 h-4 mr-2" />
        Test in Playground
      </Button>
      <Button onClick={onCopyPrompt} variant="outline" size="sm">
        <Copy className="w-4 h-4 mr-2" />
        Copy
      </Button>
      <Button onClick={onSavePrompt} variant="outline" size="sm">
        <Save className="w-4 h-4 mr-2" />
        Save
      </Button>
      <Button onClick={handleDownloadJSON} variant="outline" size="sm">
        <Download className="w-4 h-4 mr-2" />
        Download JSON
      </Button>
    </div>
  );
}
