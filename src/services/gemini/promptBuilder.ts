
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

CRITICAL: Your response MUST be ONLY valid JSON. No markdown, no code blocks, no additional text.

Respond with this EXACT JSON structure:

{
  "optimized_prompt": "Your enhanced prompt text here - make this detailed and comprehensive",
  "preview_title": "Brief descriptive title for the prompt",
  "tags": ["relevant", "descriptive", "tags"],
  "variables": [{"name": "variable_name", "type": "text", "required": true, "description": "What this variable represents"}],
  "metadata": {
    "complexity_score": 8,
    "creativity_score": 7,
    "coherence_score": 9,
    "estimated_tokens": 200
  },
  "remix_suggestions": ["Specific improvement suggestion", "Another enhancement idea", "Third optimization option"]
}

REQUIREMENTS:
- optimized_prompt: Must be a complete, actionable prompt (minimum 100 words)
- preview_title: Concise title describing the prompt's purpose
- tags: 3-5 relevant tags for categorization
- variables: Array of customizable elements (can be empty if none needed)
- metadata: Numerical scores from 1-10 and realistic token estimate
- remix_suggestions: 3-4 specific ways to improve or modify the prompt

Return ONLY the JSON object. No other text, formatting, or explanations.`;
  }
}
