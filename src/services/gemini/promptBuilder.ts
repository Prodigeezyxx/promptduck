
import { GenerationRequest } from '@/types';
import { HEURISTICS } from '@/constants';

export class GeminiPromptBuilder {
  static buildSystemPrompt(request: GenerationRequest): string {
    const heuristicsDesc = request.heuristics.map(h => HEURISTICS[h].description).join(', ');

    return `Generate an optimized technical prompt following PromptDuck specifications.

TECHNICAL REQUIREMENTS:
- Intent: ${request.intent}
- Applied Methodologies: ${heuristicsDesc}
- Context: ${request.context || 'No additional context provided'}
- Complexity Level: ${request.complexity || 'intermediate'}

MANDATORY OUTPUT CHARACTERISTICS:
1. Technical and factual language only
2. Step-by-step instructional format
3. Data-oriented and expert-level content
4. No roleplay, anthropomorphic framing, or emotional language
5. Structured, numbered procedures where applicable

Applied cognitive methodologies: ${request.heuristics.join(', ')}.

OUTPUT FORMAT: Return ONLY valid JSON with no markdown formatting.

Required JSON structure:

{
  "optimized_prompt": "Technical prompt with step-by-step instructions and factual specifications",
  "preview_title": "Factual description of the prompt's technical purpose",
  "tags": ["technical", "descriptive", "tags"],
  "variables": [{"name": "variable_name", "type": "text", "required": true, "description": "Technical specification of this parameter"}],
  "metadata": {
    "complexity_score": 8,
    "creativity_score": 7,
    "coherence_score": 9,
    "estimated_tokens": 200
  },
  "remix_suggestions": ["Technical improvement specification", "Additional methodology integration", "Enhanced structural optimization"]
}

SPECIFICATIONS:
- optimized_prompt: Technical instruction set with numbered steps (minimum 100 words)
- preview_title: Factual summary of prompt functionality
- tags: 3-5 technical classification tags
- variables: Configurable parameters with technical specifications
- metadata: Numerical assessments (1-10 scale) and token estimation
- remix_suggestions: 3-4 technical enhancement specifications

Generate structured, factual content without anthropomorphic language or roleplay elements.`;
  }
}
