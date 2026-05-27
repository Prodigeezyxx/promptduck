import { GenerationRequest } from '@/types';
import { HEURISTICS } from '@/constants';
import { MODES } from '@/constants/modes';
import { MASTER_SYSTEM_PROMPT, PROMPT_DUCK_SPECIFICATION } from '@/constants/prompts';

export class OpenAIPromptBuilder {
  static buildSystemPrompt(request: GenerationRequest): Array<{role: 'system' | 'user' | 'assistant', content: string}> {
    const mode = request.mode && MODES[request.mode] ? MODES[request.mode] : MODES.general;
    const heuristicsDesc = request.heuristics.map(h => HEURISTICS[h]?.description || h).join(', ');

    // Special handling for Builder Transformer mode
    if (mode.id === 'builder') {
      return this.buildBuilderTransformerPrompt(request, mode, heuristicsDesc);
    }

    // Standard mode handling
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
}`;

    return [
      { role: 'system', content: systemMessage }
    ];
  }

  private static buildBuilderTransformerPrompt(request: GenerationRequest, mode: any, heuristicsDesc: string): Array<{role: 'system' | 'user' | 'assistant', content: string}> {
    const systemMessage = `${mode.systemPromptModifier}

BUILDER PROMPT TRANSFORMER ENGINE:

Your role is to analyze the user's input and transform it into a highly effective, structured prompt optimized for app development.

PROCESSING WORKFLOW:
1. INTENT CLASSIFICATION: Analyze the input to classify primary intent:
   - New Project Scaffolding: "build," "create app," "start project"
   - UI/Design Modification: "style," "responsive," "colors," "layout"
   - Code Refactoring: "clean up," "refactor," "organize"
   - Debugging: "error," "fix," "not working," "bug"
   - Feature Addition: "add feature," "implement," "change how X works"
   - Vague/Ambiguous: Input too broad to be actionable

2. TEMPLATE AUGMENTATION: Apply corresponding best-practice templates
3. OUTPUT GENERATION: Create structured, copy-paste-ready markdown

CURRENT REQUEST ANALYSIS:
- User Intent: ${request.intent}
- Additional Context: ${request.context || 'None provided'}
- Applied Heuristics: ${heuristicsDesc}
- Complexity Level: ${request.complexity || 'intermediate'}

BUILDER-SPECIFIC OPTIMIZATIONS:
- React + TypeScript + Tailwind CSS focus
- Component-driven architecture
- Mobile-first responsive design
- shadcn/ui integration
- Safety rails to prevent breaking functionality
- Clear separation of planning vs implementation

OUTPUT FORMAT: Return ONLY valid JSON with structured prompt templates:

{
  "optimized_prompt": "Complete, copy-paste-ready prompt with intent-specific template applied",
  "preview_title": "Clear description of the generated prompt's purpose",
  "tags": ["builder", "prompt-engineering", "intent-classification"],
  "variables": [{"name": "detected_intent", "type": "text", "required": true, "description": "Primary intent classification result"}],
  "metadata": {
    "complexity_score": 9,
    "creativity_score": 8,
    "coherence_score": 10,
    "estimated_tokens": 300,
    "mode": "builder",
    "target_platform": "App Development",
    "detected_intent": "classified_intent_type",
    "template_applied": "template_type_used"
  },
  "remix_suggestions": [
    "Apply advanced component architecture patterns",
    "Integrate additional safety constraints",
    "Add mobile-first responsive enhancements",
    "Include accessibility considerations"
  ]
}

Generate a sophisticated, template-based prompt that transforms the user's input into actionable app development instructions.`;

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
