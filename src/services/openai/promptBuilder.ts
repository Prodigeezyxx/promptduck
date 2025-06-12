
import { GenerationRequest } from '@/types';
import { HEURISTICS } from '@/constants';
import { MASTER_SYSTEM_PROMPT, PROMPT_DUCK_SPECIFICATION } from '@/constants/prompts';

export class OpenAIPromptBuilder {
  static buildSystemPrompt(request: GenerationRequest): Array<{role: 'system' | 'user' | 'assistant', content: string}> {
    const heuristicsDesc = request.heuristics.map(h => HEURISTICS[h]?.description || h).join(', ');

    const systemMessage = `${MASTER_SYSTEM_PROMPT}

CURRENT REQUEST ANALYSIS:
- Intent: ${request.intent}
- Applied Heuristics: ${heuristicsDesc}
- Context: ${request.context || 'No additional context provided'}
- Complexity Level: ${request.complexity || 'intermediate'}

${PROMPT_DUCK_SPECIFICATION}

TECHNICAL PROCESSING INSTRUCTIONS:
1. Analyze the user intent using technical classification methods
2. Apply appropriate heuristic combinations systematically
3. Generate structured, technical prompt specifications
4. Ensure output serves as executable instructions for other AI systems
5. Maintain technical precision and eliminate anthropomorphic language

OUTPUT FORMAT: Return ONLY valid JSON with no markdown formatting.

Required JSON structure:
{
  "optimized_prompt": "Technical prompt specification with numbered procedures and factual instructions",
  "preview_title": "Factual description of the prompt's technical functionality",
  "tags": ["technical", "classification", "tags"],
  "variables": [{"name": "variable_name", "type": "text", "required": true, "description": "Technical specification of parameter"}],
  "metadata": {
    "complexity_score": 8,
    "creativity_score": 7,
    "coherence_score": 9,
    "estimated_tokens": 200
  },
  "remix_suggestions": ["Technical enhancement specification", "Systematic improvement method", "Advanced optimization approach"]
}

SPECIFICATIONS:
- optimized_prompt: Technical instruction set with numbered steps (minimum 100 words)
- preview_title: Factual summary of prompt functionality
- tags: 3-5 technical classification tags  
- variables: Configurable parameters with technical specifications
- metadata: Numerical assessments (1-10 scale) and token estimation
- remix_suggestions: 3-4 technical enhancement specifications

Generate structured, factual prompt specifications without anthropomorphic language or conversational elements.`;

    return [
      { role: 'system', content: systemMessage }
    ];
  }

  static buildChatMessages(prompt: string): Array<{role: 'system' | 'user' | 'assistant', content: string}> {
    const systemPrompt = `You are a technical AI assistant designed to provide direct, factual responses to user prompts. Your primary function is to fulfill requests with precision and technical accuracy.

Technical Guidelines:
- Generate direct, substantive responses based on the user's prompt
- Provide complete, factual information with clear explanations
- Use structured, step-by-step approaches when applicable
- Maintain technical precision and avoid anthropomorphic language
- Focus on delivering actionable, expert-level content
- Only ask clarifying questions if the prompt lacks essential technical details
- Prioritize technical accuracy and systematic approaches over conversational elements`;

    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];
  }
}
