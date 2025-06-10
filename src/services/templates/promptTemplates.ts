
import { IntentType } from '../intent/intentDetection';
import { HeuristicType } from '@/types';

export interface PromptTemplate {
  id: string;
  name: string;
  intent: IntentType;
  template: (input: string, context?: string) => string;
  requiredHeuristics: HeuristicType[];
  optionalHeuristics: HeuristicType[];
  complexity: 'simple' | 'intermediate' | 'advanced';
  tags: string[];
}

export const ENHANCED_TEMPLATES: Record<IntentType, PromptTemplate[]> = {
  instructional: [
    {
      id: 'instructional-detailed',
      name: 'Detailed Step-by-Step Guide',
      intent: 'instructional',
      template: (input, context) => 
        `You are a world-class expert instructor. Create a comprehensive, step-by-step guide for: ${input}${context ? `\n\nContext: ${context}` : ''}\n\nStructure your response with:\n1. Clear numbered steps\n2. Prerequisites and requirements\n3. Expected outcomes\n4. Common pitfalls to avoid\n5. Additional resources`,
      requiredHeuristics: ['multi_role_collision', 'recursive_refinement'],
      optionalHeuristics: ['context_anchoring'],
      complexity: 'intermediate',
      tags: ['educational', 'step-by-step', 'comprehensive']
    },
    {
      id: 'instructional-quick',
      name: 'Quick How-To Guide',
      intent: 'instructional',
      template: (input, context) => 
        `Provide a concise, actionable guide for: ${input}${context ? ` (Context: ${context})` : ''}\n\nFormat as a numbered list with clear, actionable steps.`,
      requiredHeuristics: ['recursive_refinement'],
      optionalHeuristics: ['context_anchoring'],
      complexity: 'simple',
      tags: ['quick', 'actionable', 'concise']
    }
  ],
  
  code: [
    {
      id: 'code-implementation',
      name: 'Code Implementation with Best Practices',
      intent: 'code',
      template: (input, context) => 
        `You are a senior software engineer with expertise in best practices. Implement the following: ${input}${context ? `\n\nAdditional context: ${context}` : ''}\n\nRequirements:\n- Write clean, readable code\n- Include comprehensive comments\n- Follow language-specific conventions\n- Add error handling where appropriate\n- Provide usage examples`,
      requiredHeuristics: ['self_repairing', 'recursive_refinement'],
      optionalHeuristics: ['multi_role_collision'],
      complexity: 'advanced',
      tags: ['code', 'best-practices', 'documentation']
    },
    {
      id: 'code-debug',
      name: 'Code Debugging and Optimization',
      intent: 'code',
      template: (input, context) => 
        `You are an expert debugger and code optimizer. Analyze and improve this code: ${input}${context ? `\n\nContext: ${context}` : ''}\n\nProvide:\n1. Issue identification\n2. Fixed code\n3. Performance improvements\n4. Security considerations\n5. Testing recommendations`,
      requiredHeuristics: ['self_repairing', 'multi_role_collision'],
      optionalHeuristics: ['recursive_refinement'],
      complexity: 'advanced',
      tags: ['debugging', 'optimization', 'analysis']
    }
  ],

  analytical: [
    {
      id: 'analytical-comprehensive',
      name: 'Comprehensive Analysis',
      intent: 'analytical',
      template: (input, context) => 
        `You are a critical thinking expert. Provide a thorough analysis of: ${input}${context ? `\n\nContext: ${context}` : ''}\n\nStructure your analysis with:\n1. Executive summary\n2. Key findings\n3. Supporting evidence\n4. Potential counterarguments\n5. Conclusions and recommendations`,
      requiredHeuristics: ['multi_role_collision', 'contradiction_stacking'],
      optionalHeuristics: ['recursive_refinement'],
      complexity: 'advanced',
      tags: ['analysis', 'critical-thinking', 'comprehensive']
    }
  ],

  creative: [
    {
      id: 'creative-storytelling',
      name: 'Creative Storytelling',
      intent: 'creative',
      template: (input, context) => 
        `You are a master storyteller with vivid imagination. Create an engaging story based on: ${input}${context ? `\n\nSetting/Context: ${context}` : ''}\n\nInclude:\n- Compelling characters\n- Rich descriptions\n- Engaging plot\n- Emotional depth\n- Satisfying resolution`,
      requiredHeuristics: ['contradiction_stacking', 'time_distortion'],
      optionalHeuristics: ['context_anchoring'],
      complexity: 'intermediate',
      tags: ['creative', 'storytelling', 'narrative']
    }
  ],

  conversational: [
    {
      id: 'conversational-friendly',
      name: 'Friendly Conversation',
      intent: 'conversational',
      template: (input, context) => 
        `You are a friendly, knowledgeable conversation partner. Let's discuss: ${input}${context ? ` (Context: ${context})` : ''}\n\nEngage naturally while being informative and helpful.`,
      requiredHeuristics: ['context_anchoring'],
      optionalHeuristics: [],
      complexity: 'simple',
      tags: ['conversation', 'friendly', 'informal']
    }
  ],

  business: [
    {
      id: 'business-strategy',
      name: 'Business Strategy Framework',
      intent: 'business',
      template: (input, context) => 
        `You are a seasoned business strategist. Develop a strategic approach for: ${input}${context ? `\n\nBusiness context: ${context}` : ''}\n\nProvide:\n1. Situation analysis\n2. Strategic options\n3. Recommended approach\n4. Implementation roadmap\n5. Success metrics`,
      requiredHeuristics: ['multi_role_collision', 'recursive_refinement'],
      optionalHeuristics: ['contradiction_stacking'],
      complexity: 'advanced',
      tags: ['business', 'strategy', 'framework']
    }
  ],

  technical: [
    {
      id: 'technical-architecture',
      name: 'Technical Architecture Design',
      intent: 'technical',
      template: (input, context) => 
        `You are a principal architect with deep technical expertise. Design a solution for: ${input}${context ? `\n\nTechnical constraints: ${context}` : ''}\n\nInclude:\n1. Architecture overview\n2. Component design\n3. Technology choices\n4. Scalability considerations\n5. Risk mitigation`,
      requiredHeuristics: ['self_repairing', 'multi_role_collision'],
      optionalHeuristics: ['recursive_refinement'],
      complexity: 'advanced',
      tags: ['technical', 'architecture', 'design']
    }
  ],

  unknown: [
    {
      id: 'unknown-clarification',
      name: 'Request Clarification',
      intent: 'unknown',
      template: (input, context) => 
        `Help clarify and improve this request: ${input}${context ? `\n\nAdditional context: ${context}` : ''}\n\nProvide specific questions to better understand the intent and suggest a more detailed prompt.`,
      requiredHeuristics: ['multi_role_collision'],
      optionalHeuristics: ['context_anchoring'],
      complexity: 'intermediate',
      tags: ['clarification', 'improvement', 'refinement']
    }
  ]
};

export class PromptTemplateEngine {
  static getTemplatesForIntent(intent: IntentType): PromptTemplate[] {
    return ENHANCED_TEMPLATES[intent] || ENHANCED_TEMPLATES.unknown;
  }

  static getBestTemplate(intent: IntentType, complexity: 'simple' | 'intermediate' | 'advanced'): PromptTemplate {
    const templates = this.getTemplatesForIntent(intent);
    
    // Find template matching complexity, or fallback to first available
    const matchingTemplate = templates.find(t => t.complexity === complexity);
    return matchingTemplate || templates[0];
  }

  static applyTemplate(template: PromptTemplate, input: string, context?: string): string {
    return template.template(input, context);
  }

  static getAllTemplates(): PromptTemplate[] {
    return Object.values(ENHANCED_TEMPLATES).flat();
  }
}
