
import { HeuristicType } from '@/types';
import { IntentDetectionEngine } from '@/services/intent/intentDetection';

export function selectHeuristics(intent: string, context?: string): HeuristicType[] {
  const intentAnalysis = IntentDetectionEngine.analyzeIntent(intent, context);
  return intentAnalysis.suggestedHeuristics;
}
