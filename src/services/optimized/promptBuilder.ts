
import { IntentType } from '../intent/intentDetection';

export class OptimizedPromptBuilder {
  static buildDynamicChatPrompt(prompt: string, intent?: IntentType): string {
    // Base system prompt - minimal but effective
    let systemPrompt = "You are a helpful AI assistant. Provide direct, accurate responses.";
    
    // Add intent-specific guidance only when needed
    if (intent) {
      const intentGuidance = this.getIntentGuidance(intent);
      if (intentGuidance) {
        systemPrompt += ` ${intentGuidance}`;
      }
    }
    
    // Add complexity guidance only for complex prompts
    if (prompt.length > 200 || this.isComplexPrompt(prompt)) {
      systemPrompt += " Break down complex topics into clear, structured responses.";
    }
    
    return systemPrompt;
  }

  private static getIntentGuidance(intent: IntentType): string {
    const guidance = {
      code: "Focus on clean, working code with brief explanations.",
      instructional: "Provide step-by-step instructions.",
      analytical: "Give structured analysis with key insights.",
      creative: "Be imaginative while staying relevant.",
      business: "Focus on practical, actionable advice.",
      technical: "Provide precise technical information."
    };
    
    return guidance[intent] || "";
  }

  private static isComplexPrompt(prompt: string): boolean {
    const complexIndicators = ['analyze', 'compare', 'explain', 'step-by-step', 'detailed', 'comprehensive'];
    return complexIndicators.some(indicator => 
      prompt.toLowerCase().includes(indicator)
    );
  }

  static buildFastGenerationPrompt(intent: string, heuristics: string[]): string {
    // Streamlined prompt for fast generation
    return `Generate an optimized prompt for: ${intent}

Apply these methods: ${heuristics.slice(0, 3).join(', ')}

Return only valid JSON:
{
  "optimized_prompt": "enhanced prompt text",
  "preview_title": "brief title",
  "tags": ["3", "tags", "max"],
  "variables": [],
  "metadata": {"complexity_score": 8, "creativity_score": 7, "coherence_score": 9, "estimated_tokens": 150},
  "remix_suggestions": ["suggestion1", "suggestion2"]
}`;
  }
}
