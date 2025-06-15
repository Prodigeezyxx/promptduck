
import { FormSection } from "./FormSection";
import { Sparkles } from "lucide-react";

interface GenerateStepProps {
  intent: string;
  context: string;
  complexity: 'simple' | 'intermediate' | 'advanced';
  isGenerating: boolean;
  onGenerate: () => void;
}

export function GenerateStep({
  intent,
  context,
  complexity,
  isGenerating,
  onGenerate,
}: GenerateStepProps) {
  return (
    <FormSection
      title="Ready to generate"
      description="Your optimized prompt will appear here. Fill out the form on the left to get started."
      step={3}
      totalSteps={3}
    >
      <div className="flex flex-col items-center justify-center mt-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <Sparkles className="w-10 h-10 text-brand-400 opacity-80" />
        </div>
        <p className="text-lg font-semibold text-white mb-2">Ready to generate</p>
        <p className="text-muted-foreground mb-8 text-center max-w-sm">
          Your optimized prompt will appear here. Fill out the form on the left to get started.
        </p>
        <div className="w-full max-w-xs rounded-xl bg-surface/80 p-5 shadow-soft-inner mt-3">
          <p className="text-sm font-bold mb-2 text-white">What you'll get:</p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>AI-optimized prompt structure</li>
            <li>Applied cognitive heuristics</li>
            <li>Remix suggestions for variations</li>
            <li>Ready-to-use in playground</li>
          </ul>
        </div>
      </div>
    </FormSection>
  );
}
