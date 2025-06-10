export interface Prompt {
  id: string;
  title: string;
  content: string;
  description?: string;
  tags: string[];
  persona: PersonaType;
  heuristics: HeuristicType[];
  variables: PromptVariable[];
  created_at: string;
  updated_at: string;
  version: number;
  parent_id?: string;
  usage_count: number;
  rating?: number;
  category: PromptCategory;
}

export interface PromptVariable {
  name: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  default?: string;
  options?: string[];
  required: boolean;
  description?: string;
}

export type PersonaType = 'strategist' | 'dreamer' | 'builder' | 'connector' | 'creator';

export type HeuristicType = 
  | 'multi_role_collision'
  | 'recursive_refinement'
  | 'contradiction_stacking'
  | 'time_distortion'
  | 'context_anchoring'
  | 'self_repairing';

export type PromptCategory = 
  | 'content_creation'
  | 'product_thinking'
  | 'learning_research'
  | 'thought_leadership'
  | 'personal_branding'
  | 'course_workshop'
  | 'general';

export interface GenerationRequest {
  intent: string;
  persona?: PersonaType;
  heuristics: HeuristicType[];
  context?: string;
  style?: 'concise' | 'detailed' | 'creative';
  complexity?: 'simple' | 'intermediate' | 'advanced';
}

export interface GenerationResult {
  optimized_prompt: string;
  preview_title: string;
  tags: string[];
  heuristics: HeuristicType[];
  variables: PromptVariable[];
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

export interface UserProfile {
  id: string;
  primary_mode: PersonaType;
  preference_clarity: 'clarity' | 'chaos';
  preference_progress: 'linear' | 'nonlinear';
  usage_patterns: {
    most_used_personas: PersonaType[];
    most_used_heuristics: HeuristicType[];
    most_used_categories: PromptCategory[];
  };
  onboarding_completed: boolean;
}

export interface Credit {
  daily_limit: number;
  used_today: number;
  last_reset: string;
  premium: boolean;
}

export interface ApiKey {
  gemini: string;
  created_at: string;
  last_used?: string;
  status: 'active' | 'inactive' | 'invalid';
}

export interface PlaygroundSession {
  id: string;
  prompt_id: string;
  variables: Record<string, string>;
  result: string;
  timestamp: string;
  rating?: number;
  notes?: string;
}

export interface SystemPrompt {
  id: string;
  name: string;
  content: string;
  description: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromptChain {
  id: string;
  prompts: string[];
  relationships: Array<{
    from: number;
    to: number;
    type: 'sequence' | 'conditional' | 'parallel';
  }>;
  current_step: number;
  context: Record<string, any>;
}

export interface RemixSuggestion {
  id: string;
  type: 'contradict' | 'time_warp' | 'switch_archetype' | 'merge_chain';
  description: string;
  preview: string;
  difficulty: 'easy' | 'medium' | 'hard';
}
