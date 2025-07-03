import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Save, Download, CheckCircle, FileJson, SplitSquareHorizontal } from 'lucide-react';
import { GenerationResult } from '@/types';
import { downloadLovableJSON } from '@/utils/lovableExporter';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface LovableActionsProps {
  result: GenerationResult;
  originalIntent: string;
  originalContext?: string;
  onCopyPrompt: () => void;
  onSavePrompt: () => void;
}

export function LovableActions({ 
  result, 
  originalIntent,
  originalContext,
  onCopyPrompt, 
  onSavePrompt 
}: LovableActionsProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCopy = () => {
    onCopyPrompt();
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSave = () => {
    onSavePrompt();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleLovableJSONDownload = () => {
    downloadLovableJSON(result, originalIntent, originalContext);
  };

  const copySection = (sectionName: string, content: string) => {
    navigator.clipboard.writeText(content);
    // Could add a toast here for feedback
  };

  // Extract sections for R-T-C-F-G structure
  const extractSection = (sectionName: string): string => {
    const prompt = result.optimized_prompt || result.result;
    const regex = new RegExp(`${sectionName}:\\s*(.*?)(?=\\n[A-Z]+:|$)`, 's');
    const match = prompt.match(regex);
    return match?.[1]?.trim() || '';
  };

  return (
    <TooltipProvider>
      <div className="flex gap-2">
        {/* Primary Actions */}
        <Button
          onClick={handleCopy}
          className={`flex-1 transition-all ${
            copySuccess ? 'bg-green-500 hover:bg-green-600' : ''
          }`}
          variant={copySuccess ? "default" : "outline"}
        >
          {copySuccess ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Full Prompt
            </>
          )}
        </Button>
        
        <Button
          onClick={handleSave}
          className={`flex-1 transition-all ${
            saveSuccess ? 'bg-green-500 hover:bg-green-600' : ''
          }`}
          variant={saveSuccess ? "default" : "outline"}
        >
          {saveSuccess ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save to Library
            </>
          )}
        </Button>

        {/* Advanced Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleLovableJSONDownload}>
              <FileJson className="w-4 h-4 mr-2" />
              Lovable JSON (Enhanced)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => copySection('CONTEXT', extractSection('CONTEXT'))}>
              <SplitSquareHorizontal className="w-4 h-4 mr-2" />
              Copy Context Section
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => copySection('TASK', extractSection('TASK'))}>
              <SplitSquareHorizontal className="w-4 h-4 mr-2" />
              Copy Task Section
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => copySection('CONSTRAINTS', extractSection('CONSTRAINTS'))}>
              <SplitSquareHorizontal className="w-4 h-4 mr-2" />
              Copy Constraints Section
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => copySection('GOAL', extractSection('GOAL'))}>
              <SplitSquareHorizontal className="w-4 h-4 mr-2" />
              Copy Goal Section
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
}