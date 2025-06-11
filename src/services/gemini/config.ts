
export const GEMINI_CONFIG = {
  models: [
    'gemini-2.0-flash-exp',
    'gemini-2.5-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
  ],
  maxRetries: 1, // Reduced from 3 for faster failure
  fallbackPrompt: {
    complexity_score: 7,
    creativity_score: 6,
    coherence_score: 8,
    estimated_tokens: 150,
    confidence_score: 0.8,
    generation_time_ms: 0
  }
} as const;
