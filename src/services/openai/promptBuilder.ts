
import { GenerationRequest } from '@/types';
import { HEURISTICS } from '@/constants';
import { MODES } from '@/constants/modes';
import { MASTER_SYSTEM_PROMPT, PROMPT_DUCK_SPECIFICATION } from '@/constants/prompts';

export class OpenAIPromptBuilder {
  static buildSystemPrompt(request: GenerationRequest): Array<{role: 'system' | 'user' | 'assistant', content: string}> {
    const mode = request.mode && MODES[request.mode] ? MODES[request.mode] : MODES.general;
    const heuristicsDesc = request.heuristics.map(h => HEURISTICS[h]?.description || h).join(', ');

    // Apply mode-specific context injection
    const modeContext = mode.contextInjection.join('\n- ');
    const formatRules = mode.formatRules.join('\n- ');

    const systemMessage = `${MASTER_SYSTEM_PROMPT}

MODE OPTIMIZATION: ${mode.name.toUpperCase()}
Target Platform: ${mode.targetPlatform}
${mode.systemPromptModifier}

MODE-SPECIFIC CONTEXT:
- ${modeContext}

MODE-SPECIFIC FORMAT RULES:
- ${formatRules}

CURRENT REQUEST ANALYSIS:
- Intent: ${request.intent}
- Applied Heuristics: ${heuristicsDesc}
- Context: ${request.context || 'No additional context provided'}
- Complexity Level: ${request.complexity || 'intermediate'}
- Mode: ${mode.name} (${mode.description})

${PROMPT_DUCK_SPECIFICATION}

TECHNICAL PROCESSING INSTRUCTIONS:
1. Analyze the user intent using technical classification methods
2. Apply appropriate heuristic combinations systematically
3. Apply mode-specific optimizations for ${mode.targetPlatform}
4. Generate structured, technical prompt specifications optimized for ${mode.name} mode
5. Ensure output serves as executable instructions for ${mode.targetPlatform}
6. Maintain technical precision while following ${mode.name}-specific patterns

OUTPUT FORMAT: Return ONLY valid JSON with no markdown formatting.

Required JSON structure optimized for ${mode.name} mode:
{
  "optimized_prompt": "Technical prompt specification with numbered procedures and ${mode.name}-specific optimizations",
  "preview_title": "Factual description of the prompt's technical functionality for ${mode.targetPlatform}",
  "tags": ["${mode.id}", "technical", "classification", "tags"],
  "variables": [{"name": "variable_name", "type": "text", "required": true, "description": "Technical specification of parameter"}],
  "metadata": {
    "complexity_score": 8,
    "creativity_score": 7,
    "coherence_score": 9,
    "estimated_tokens": 200,
    "mode": "${mode.id}",
    "target_platform": "${mode.targetPlatform}"
  },
  "remix_suggestions": ["${mode.name}-specific enhancement specification", "Platform-optimized improvement method", "Advanced ${mode.targetPlatform} optimization approach"]
}

SPECIFICATIONS FOR ${mode.name.toUpperCase()} MODE:
- optimized_prompt: Technical instruction set with numbered steps optimized for ${mode.targetPlatform} (minimum 100 words)
- preview_title: Factual summary of prompt functionality for ${mode.name} context
- tags: Include "${mode.id}" as first tag, followed by 3-4 technical classification tags  
- variables: Configurable parameters with ${mode.name}-specific technical specifications
- metadata: Include mode and target_platform fields
- remix_suggestions: 3-4 ${mode.name}-specific technical enhancement specifications

Generate structured, factual prompt specifications optimized for ${mode.targetPlatform} without anthropomorphic language or conversational elements.`;

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
