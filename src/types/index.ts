
// Import mode types first
import type { ModeType, Mode, ModeConfiguration } from './modes';

// Re-export mode types
export type { ModeType, Mode, ModeConfiguration } from './modes';

export interface GenerationRequest {
  intent: string;
  context?: string | undefined;
  complexity?: 'simple' | 'intermediate' | 'advanced';
  heuristics: string[];
  mode?: ModeType; // Add mode support
}

export interface Variable {
  name: string;
  type: 'text' | 'number' | 'boolean';
  required: boolean;
  description: string;
}

export interface GenerationResult {
  id?: string;
  result: string;
  metadata: {
    intent: string;
    context?: string;
    complexity?: 'simple' | 'intermediate' | 'advanced';
    heuristics?: string[];
    complexity_score?: number;
    creativity_score?: number;
    coherence_score?: number;
    estimated_tokens?: number;
    confidence_score?: number;
    generation_time_ms?: number;
    improvement_confidence?: number;
    template_used?: string;
    intent_detected?: string;
    heuristics_applied?: string[];
  };
  optimized_prompt?: string;
  preview_title?: string;
  tags?: string[];
  heuristics?: string[];
  variables?: Variable[];
  remix_suggestions?: string[];
  created_at?: string;
  version?: number;
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

export interface Credit {
  used: number;
  limit: number;
  resetTime: number;
  daily_limit: number;
  used_today: number;
  last_reset: string;
  premium: boolean;
}

export type HeuristicType =
  | 'universal_clarity'
  | 'format_optimization'
  | 'multi_role_collision'
  | 'recursive_refinement'
  | 'contradiction_stacking'
  | 'time_distortion'
  | 'context_anchoring'
  | 'self_repairing'
  | 'contextual_adaptation'
  | 'quality_enhancement'
  | 'clarity'
  | 'structure'
  | 'context'
  | 'validation'
  | 'creativity';

export type PromptCategory = 
  | 'content_creation'
  | 'product_thinking'
  | 'learning_research'
  | 'thought_leadership'
  | 'personal_branding'
  | 'course_workshop'
  | 'general';

export type PersonaType = 
  | 'strategist'
  | 'dreamer'
  | 'builder'
  | 'connector'
  | 'creator';

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: PromptCategory;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  persona?: PersonaType;
  heuristics?: string[];
  variables?: Variable[];
  created_at?: string;
  updated_at?: string;
  version?: number;
  usage_count?: number;
  parent_id?: string;
}

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
