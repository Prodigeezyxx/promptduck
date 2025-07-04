
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIGeneratorInputPanel } from './AIGeneratorInputPanel';
import { EnhancedAIGeneratorOutputPanel } from './EnhancedAIGeneratorOutputPanel';
import { GenerationResult, HeuristicType, ModeType } from '@/types';
import { selectHeuristics } from '@/utils/heuristicSelector';

interface TabbedWorkspaceProps {
  intent: string;
  context: string;
  selectedMode: ModeType;
  isGenerating: boolean;
  lastResult: GenerationResult | null;
  onIntentChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onModeChange: (mode: ModeType) => void;
  onGenerate: () => void;
  onCopyPrompt: () => void;
  onSavePrompt: () => void;
  onRemixSuggestion: (suggestion: string) => void;
  onStartNewPrompt: () => void;
  originalIntent?: string;
  originalContext?: string;
}

export function TabbedWorkspace({
  intent,
  context,
  selectedMode,
  isGenerating,
  lastResult,
  onIntentChange,
  onContextChange,
  onModeChange,
  onGenerate,
  onCopyPrompt,
  onSavePrompt,
  onRemixSuggestion,
  onStartNewPrompt,
  originalIntent,
  originalContext
}: TabbedWorkspaceProps) {
  const [activeTab, setActiveTab] = useState('edit');
  const selectedHeuristics = selectHeuristics(intent, context) as HeuristicType[];
  const complexity = 'intermediate' as const;

  // Auto-switch to results tab when generation completes
  if (lastResult && activeTab === 'edit' && !isGenerating) {
    setActiveTab('results');
  }

  return (
    <div className="h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="edit" className="text-sm">
            Edit
          </TabsTrigger>
          <TabsTrigger value="results" className="text-sm">
            Results
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent 
            value="edit" 
            className="h-full overflow-y-auto max-h-[400px] pr-2 space-y-4 mt-0"
          >
            <AIGeneratorInputPanel
              intent={intent}
              context={context}
              complexity={complexity}
              selectedHeuristics={selectedHeuristics}
              selectedMode={selectedMode}
              isGenerating={isGenerating}
              onIntentChange={onIntentChange}
              onContextChange={onContextChange}
              onComplexityChange={() => {}} // Not used in compact version
              onModeChange={onModeChange}
              onGenerate={onGenerate}
            />
          </TabsContent>

          <TabsContent 
            value="results" 
            className="h-full overflow-y-auto max-h-[400px] pr-2 mt-0"
          >
            <EnhancedAIGeneratorOutputPanel
              isGenerating={isGenerating}
              lastResult={lastResult}
              selectedMode={selectedMode}
              originalIntent={originalIntent || intent}
              originalContext={originalContext || context}
              onCopyPrompt={onCopyPrompt}
              onSavePrompt={onSavePrompt}
              onRemixSuggestion={onRemixSuggestion}
              onStartNewPrompt={onStartNewPrompt}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
