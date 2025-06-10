
import { GenerationRequest } from '@/types';
import { HEURISTICS } from '@/constants';

export class GeminiPromptBuilder {
  static buildSystemPrompt(request: GenerationRequest): string {
    const heuristicsDesc = request.heuristics.map(h => HEURISTICS[h].description).join(', ');

    return `You are an expert prompt engineer. Create an optimized prompt using cognitive heuristics.

TASK DETAILS:
- Intent: ${request.intent}
- Applied Heuristics: ${heuristicsDesc}
- Context: ${request.context || 'No additional context provided'}
- Complexity Level: ${request.complexity || 'intermediate'}

Apply these cognitive approaches: ${request.heuristics.join(', ')}.

IMPORTANT: You MUST respond with ONLY valid JSON in exactly this format:

{
  "optimized_prompt": "Your enhanced prompt text here",
  "preview_title": "Brief descriptive title",
  "tags": ["relevant", "tags", "here"],
  "variables": [{"name": "example_var", "type": "text", "required": true, "description": "Variable description"}],
  "metadata": {
    "complexity_score": 8,
    "creativity_score": 7,
    "coherence_score": 9,
    "estimated_tokens": 200
  },
  "remix_suggestions": ["Add specific constraints", "Include examples", "Add step-by-step format"]
}

Do not include any text before or after the JSON. Respond only with the JSON object.`;
  }
}
