
import { GenerationRequest } from '@/types';
import { HEURISTICS } from '@/constants';

export class GeminiPromptBuilder {
  static buildSystemPrompt(request: GenerationRequest): string {
    const heuristicsDesc = request.heuristics.map(h => HEURISTICS[h].description).join(', ');

    // Optimized shorter prompt to reduce token usage
    return `Create an optimized prompt using these cognitive heuristics:

INTENT: ${request.intent}
HEURISTICS: ${heuristicsDesc}
CONTEXT: ${request.context || 'None'}
COMPLEXITY: ${request.complexity || 'intermediate'}

Apply these approaches: ${request.heuristics.join(', ')}.

Return ONLY valid JSON:
{
  "optimized_prompt": "enhanced prompt text",
  "preview_title": "descriptive title",
  "tags": ["relevant", "tags"],
  "variables": [{"name": "var", "type": "text", "required": true, "description": "desc"}],
  "metadata": {
    "complexity_score": 8,
    "creativity_score": 7,
    "coherence_score": 9,
    "estimated_tokens": 200
  },
  "remix_suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}`;
  }
}
