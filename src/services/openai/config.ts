
export const OPENAI_CONFIG = {
  models: [
    'gpt-4o-2024-11-20', // Latest and fastest GPT-4o
    'gpt-4o-mini', // Fast and cost-effective
    'gpt-4-turbo', // Fallback option
    'gpt-3.5-turbo' // Final fallback
  ],
  maxRetries: 1, // Fast failure for better UX
  maxTokens: 4096, // Increased to prevent truncation
  fallbackPrompt: {
    complexity_score: 7,
    creativity_score: 6,
    coherence_score: 8,
    estimated_tokens: 150,
    confidence_score: 0.8,
    generation_time_ms: 0
  }
} as const;
