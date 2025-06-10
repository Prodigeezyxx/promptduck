
import { HeuristicType } from '@/types';
import { IntentType } from '../intent/intentDetection';

export interface HeuristicRule {
  id: string;
  name: string;
  description: string;
  apply: (prompt: string, intent: IntentType, context?: string) => string;
  triggers: string[];
  weight: number;
}

export interface HeuristicApplication {
  heuristic: HeuristicType;
  rule: HeuristicRule;
  applied: boolean;
  reason: string;
}

const HEURISTIC_RULES: Record<HeuristicType, HeuristicRule[]> = {
  multi_role_collision: [
    {
      id: 'role-expert-addition',
      name: 'Expert Role Addition',
      description: 'Adds expert role specification when missing',
      apply: (prompt, intent) => {
        if (!prompt.toLowerCase().includes('you are') && !prompt.toLowerCase().includes('expert')) {
          const expertRole = getExpertRoleForIntent(intent);
          return `${expertRole} ${prompt}`;
        }
        return prompt;
      },
      triggers: ['analysis', 'strategy', 'technical'],
      weight: 1.0
    },
    {
      id: 'perspective-diversification',
      name: 'Multiple Perspectives',
      description: 'Adds multiple viewpoint consideration',
      apply: (prompt, intent) => {
        if (intent === 'analytical' || intent === 'business') {
          return `${prompt}\n\nConsider multiple perspectives and potential counterarguments in your response.`;
        }
        return prompt;
      },
      triggers: ['analytical', 'business'],
      weight: 0.8
    }
  ],

  recursive_refinement: [
    {
      id: 'iterative-improvement',
      name: 'Iterative Improvement Request',
      description: 'Adds self-improvement instruction',
      apply: (prompt) => {
        return `${prompt}\n\nAfter providing your initial response, review and refine it for clarity, completeness, and accuracy.`;
      },
      triggers: ['complex', 'detailed'],
      weight: 0.9
    },
    {
      id: 'step-breakdown',
      name: 'Process Breakdown',
      description: 'Requests step-by-step breakdown for complex tasks',
      apply: (prompt, intent) => {
        if (intent === 'instructional' || intent === 'code') {
          return `${prompt}\n\nBreak down your response into clear, logical steps.`;
        }
        return prompt;
      },
      triggers: ['instructional', 'code'],
      weight: 1.0
    }
  ],

  contradiction_stacking: [
    {
      id: 'paradox-exploration',
      name: 'Paradox and Tension Exploration',
      description: 'Introduces contradictory elements for creative thinking',
      apply: (prompt, intent) => {
        if (intent === 'creative' || intent === 'analytical') {
          return `${prompt}\n\nExplore any paradoxes, tensions, or contradictory elements in your response.`;
        }
        return prompt;
      },
      triggers: ['creative', 'paradox', 'tension'],
      weight: 0.7
    },
    {
      id: 'opposing-viewpoints',
      name: 'Opposing Viewpoints',
      description: 'Requests consideration of opposing perspectives',
      apply: (prompt, intent) => {
        if (intent === 'analytical' || intent === 'business') {
          return `${prompt}\n\nPresent both supporting and opposing viewpoints to provide a balanced perspective.`;
        }
        return prompt;
      },
      triggers: ['analytical', 'debate'],
      weight: 0.8
    }
  ],

  time_distortion: [
    {
      id: 'temporal-perspective',
      name: 'Multi-Temporal Analysis',
      description: 'Adds past, present, and future considerations',
      apply: (prompt, intent) => {
        if (intent === 'business' || intent === 'analytical') {
          return `${prompt}\n\nConsider the historical context, current situation, and future implications in your analysis.`;
        }
        return prompt;
      },
      triggers: ['future', 'history', 'evolution'],
      weight: 0.6
    },
    {
      id: 'scenario-timeline',
      name: 'Scenario Timeline',
      description: 'Requests timeline-based scenario planning',
      apply: (prompt, intent) => {
        if (intent === 'business' || intent === 'instructional') {
          return `${prompt}\n\nInclude a timeline or sequence of events in your response.`;
        }
        return prompt;
      },
      triggers: ['planning', 'timeline'],
      weight: 0.7
    }
  ],

  context_anchoring: [
    {
      id: 'context-enrichment',
      name: 'Context Enrichment',
      description: 'Enhances context usage and relevance',
      apply: (prompt, intent, context) => {
        if (context && context.trim()) {
          return `${prompt}\n\nMake specific reference to the provided context: "${context}" in your response.`;
        }
        return prompt;
      },
      triggers: ['context', 'specific'],
      weight: 1.0
    },
    {
      id: 'audience-awareness',
      name: 'Audience Specification',
      description: 'Adds audience consideration when missing',
      apply: (prompt) => {
        if (!prompt.toLowerCase().includes('audience') && !prompt.toLowerCase().includes('reader')) {
          return `${prompt}\n\nTailor your response to the appropriate audience level and context.`;
        }
        return prompt;
      },
      triggers: ['communication', 'explanation'],
      weight: 0.8
    }
  ],

  self_repairing: [
    {
      id: 'error-handling',
      name: 'Error Handling Enhancement',
      description: 'Adds error handling and validation instructions',
      apply: (prompt, intent) => {
        if (intent === 'code' || intent === 'technical') {
          return `${prompt}\n\nInclude proper error handling, validation, and edge case considerations.`;
        }
        return prompt;
      },
      triggers: ['code', 'technical'],
      weight: 1.0
    },
    {
      id: 'quality-assurance',
      name: 'Quality Assurance',
      description: 'Adds quality checking instructions',
      apply: (prompt) => {
        return `${prompt}\n\nValidate your response for accuracy, completeness, and potential issues before finalizing.`;
      },
      triggers: ['quality', 'validation'],
      weight: 0.9
    }
  ]
};

function getExpertRoleForIntent(intent: IntentType): string {
  const roles = {
    instructional: 'You are an expert educator and instructor.',
    code: 'You are a senior software engineer with deep technical expertise.',
    analytical: 'You are a critical thinking expert and analyst.',
    creative: 'You are a creative professional with artistic expertise.',
    business: 'You are a seasoned business strategist and consultant.',
    technical: 'You are a principal architect with extensive technical knowledge.',
    conversational: 'You are a knowledgeable and friendly expert.',
    unknown: 'You are a helpful expert assistant.'
  };
  
  return roles[intent] || roles.unknown;
}

export class EnhancedHeuristicsEngine {
  static applyHeuristics(
    prompt: string, 
    heuristics: HeuristicType[], 
    intent: IntentType, 
    context?: string
  ): { enhancedPrompt: string; applications: HeuristicApplication[] } {
    let enhancedPrompt = prompt;
    const applications: HeuristicApplication[] = [];

    heuristics.forEach(heuristicType => {
      const rules = HEURISTIC_RULES[heuristicType] || [];
      
      rules.forEach(rule => {
        const shouldApply = this.shouldApplyRule(rule, prompt, intent, context);
        
        if (shouldApply) {
          const originalPrompt = enhancedPrompt;
          enhancedPrompt = rule.apply(enhancedPrompt, intent, context);
          
          applications.push({
            heuristic: heuristicType,
            rule,
            applied: enhancedPrompt !== originalPrompt,
            reason: `Applied due to ${intent} intent and matching triggers`
          });
        }
      });
    });

    return { enhancedPrompt, applications };
  }

  private static shouldApplyRule(
    rule: HeuristicRule, 
    prompt: string, 
    intent: IntentType, 
    context?: string
  ): boolean {
    const text = `${prompt} ${context || ''}`.toLowerCase();
    
    // Check if any triggers match
    const triggerMatch = rule.triggers.some(trigger => 
      text.includes(trigger) || intent === trigger
    );
    
    // Apply based on weight and trigger match
    return triggerMatch || Math.random() < rule.weight * 0.3;
  }

  static getAvailableHeuristics(): HeuristicType[] {
    return Object.keys(HEURISTIC_RULES) as HeuristicType[];
  }

  static getHeuristicRules(heuristic: HeuristicType): HeuristicRule[] {
    return HEURISTIC_RULES[heuristic] || [];
  }
}
