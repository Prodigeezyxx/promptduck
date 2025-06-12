export interface GenerationRequest {
  intent: string;
  context?: string | undefined;
  complexity?: 'simple' | 'intermediate' | 'advanced';
  heuristics: string[];
}

export interface Variable {
  name: string;
  type: 'text' | 'number' | 'boolean';
  required: boolean;
  description: string;
}

export interface GenerationResult {
  optimized_prompt: string;
  preview_title: string;
  tags: string[];
  heuristics: string[];
  variables: Variable[];
  metadata: {
    complexity_score: number;
    creativity_score: number;
    coherence_score: number;
    estimated_tokens: number;
    confidence_score: number;
    generation_time_ms: number;
    improvement_confidence?: number;
    template_used?: string;
    intent_detected?: string;
    heuristics_applied?: string[];
  };
  remix_suggestions: string[];
}

export interface Heuristic {
  id: string;
  name: string;
  description: string;
  category: 'structure' | 'clarity' | 'creativity' | 'context' | 'validation';
  impact: 'high' | 'medium' | 'low';
  example: string;
}

export interface ApiKey {
  openai?: string;
  created_at: string;
  last_used?: string;
  status: 'active' | 'expired' | 'invalid';
}

export type HeuristicType =
  | 'clarity'
  | 'structure'
  | 'context'
  | 'validation'
  | 'creativity';

export interface PromptAnalysisResult {
  primaryIntent: string;
  secondaryIntents: string[];
  suggestedHeuristics: string[];
  missingInformation: string[];
  potentialRisks: string[];
  overallScore: number;
  feedback: string;
}

export interface PromptAnalysis {
  prompt: string;
  analysisResult: PromptAnalysisResult;
  timestamp: string;
}

export interface PromptIteration {
  id: string;
  prompt: string;
  response: string;
  analysis: PromptAnalysis;
  timestamp: string;
  parentId?: string;
}
