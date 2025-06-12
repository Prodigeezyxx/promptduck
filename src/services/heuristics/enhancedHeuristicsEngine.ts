import { HeuristicType } from '@/types';
import { IntentType } from '../intent/intentDetection';

export interface HeuristicRule {
  id: string;
  name: string;
  description: string;
  apply: (prompt: string, intent: IntentType, context?: string) => string;
  triggers: string[];
  weight: number;
  priority: number;
  category: 'universal' | 'intent-specific' | 'contextual';
}

export interface HeuristicApplication {
  heuristic: HeuristicType;
  rule: HeuristicRule;
  applied: boolean;
  reason: string;
}

const HEURISTIC_RULES: Record<HeuristicType, HeuristicRule[]> = {
  universal_clarity: [
    {
      id: 'ensure-role-definition',
      name: 'Role Definition Enhancement',
      description: 'Adds expert role specification when missing',
      apply: (prompt, intent) => {
        if (!prompt.toLowerCase().includes('you are') && !prompt.toLowerCase().includes('expert')) {
          const expertRole = getExpertRoleForIntent(intent);
          return `${expertRole} ${prompt}`;
        }
        return prompt;
      },
      triggers: ['analysis', 'strategy', 'technical', 'creative', 'instructional'],
      weight: 1.0,
      priority: 1,
      category: 'universal'
    },
    {
      id: 'clarify-ambiguous-terms',
      name: 'Ambiguity Clarification',
      description: 'Rephrases ambiguous terms into specific instructions',
      apply: (prompt) => {
        const ambiguousTerms = ['it', 'this', 'that', 'something', 'anything'];
        let hasAmbiguity = false;
        
        ambiguousTerms.forEach(term => {
          if (prompt.toLowerCase().includes(term) && !prompt.includes('specific')) {
            hasAmbiguity = true;
          }
        });
        
        if (hasAmbiguity) {
          return `${prompt}\n\nBe specific and concrete in your response, avoiding vague references.`;
        }
        return prompt;
      },
      triggers: ['vague', 'unclear', 'ambiguous'],
      weight: 0.9,
      priority: 2,
      category: 'universal'
    },
    {
      id: 'point-of-view-clarity',
      name: 'Point of View Specification',
      description: 'Clarifies perspective for response',
      apply: (prompt, intent) => {
        if (!prompt.includes('first-person') && !prompt.includes('second-person') && !prompt.includes('third-person')) {
          if (intent === 'instructional') {
            return `${prompt}\n\nWrite in second-person (you) for instructional clarity.`;
          } else if (intent === 'creative') {
            return `${prompt}\n\nChoose the most appropriate narrative perspective for your response.`;
          }
        }
        return prompt;
      },
      triggers: ['perspective', 'viewpoint', 'narrative'],
      weight: 0.7,
      priority: 3,
      category: 'universal'
    }
  ],

  format_optimization: [
    {
      id: 'output-structure-specification',
      name: 'Output Structure Enhancement',
      description: 'Specifies clear output formatting',
      apply: (prompt, intent) => {
        if (!prompt.includes('format') && !prompt.includes('structure')) {
          const formatSuggestions = {
            instructional: 'Format your response as numbered steps with clear explanations.',
            code: 'Structure your response with code blocks, comments, and examples.',
            analytical: 'Organize your analysis with headers, bullet points, and a summary.',
            creative: 'Structure your creative response with vivid descriptions and clear flow.',
            business: 'Format as executive summary, analysis, and recommendations.',
            technical: 'Structure with overview, technical details, and implementation notes.'
          };
          
          const suggestion = formatSuggestions[intent] || 'Format your response clearly and logically.';
          return `${prompt}\n\n${suggestion}`;
        }
        return prompt;
      },
      triggers: ['format', 'structure', 'organize'],
      weight: 0.8,
      priority: 2,
      category: 'universal'
    },
    {
      id: 'response-length-guidance',
      name: 'Response Length Specification',
      description: 'Provides length guidance based on complexity',
      apply: (prompt, intent, context) => {
        if (!prompt.includes('length') && !prompt.includes('brief') && !prompt.includes('detailed')) {
          const lengthGuidance = {
            conversational: 'Keep your response conversational and appropriately sized.',
            code: 'Provide comprehensive code with explanations.',
            analytical: 'Give a thorough analysis with supporting details.',
            creative: 'Create a rich, detailed response with vivid imagery.',
            instructional: 'Provide complete step-by-step instructions.'
          };
          
          const guidance = lengthGuidance[intent] || 'Provide an appropriately detailed response.';
          return `${prompt}\n\n${guidance}`;
        }
        return prompt;
      },
      triggers: ['length', 'detail', 'comprehensive'],
      weight: 0.6,
      priority: 3,
      category: 'universal'
    }
  ],

  multi_role_collision: [
    {
      id: 'multi-perspective-analysis',
      name: 'Multiple Perspectives Integration',
      description: 'Adds multiple viewpoint consideration',
      apply: (prompt, intent) => {
        if (intent === 'analytical' || intent === 'business') {
          return `${prompt}\n\nConsider multiple perspectives: technical, ethical, economic, and user experience viewpoints.`;
        }
        return prompt;
      },
      triggers: ['analytical', 'business', 'perspective'],
      weight: 0.9,
      priority: 2,
      category: 'intent-specific'
    },
    {
      id: 'role-combination-creative',
      name: 'Creative Role Combination',
      description: 'Combines roles for unique creative perspectives',
      apply: (prompt, intent) => {
        if (intent === 'creative') {
          return `${prompt}\n\nApproach this as both a creative artist and analytical thinker, blending imagination with structure.`;
        }
        return prompt;
      },
      triggers: ['creative', 'artistic', 'imagination'],
      weight: 0.8,
      priority: 2,
      category: 'intent-specific'
    }
  ],

  recursive_refinement: [
    {
      id: 'iterative-improvement-process',
      name: 'Iterative Improvement Request',
      description: 'Adds self-improvement instruction',
      apply: (prompt) => {
        return `${prompt}\n\nAfter providing your initial response, review and refine it for clarity, completeness, and accuracy.`;
      },
      triggers: ['complex', 'detailed', 'comprehensive'],
      weight: 0.9,
      priority: 2,
      category: 'intent-specific'
    },
    {
      id: 'step-breakdown-process',
      name: 'Process Breakdown Enhancement',
      description: 'Requests step-by-step breakdown for complex tasks',
      apply: (prompt, intent) => {
        if (intent === 'instructional' || intent === 'code' || intent === 'technical') {
          return `${prompt}\n\nBreak down your response into clear, logical steps with explanations for each step.`;
        }
        return prompt;
      },
      triggers: ['instructional', 'code', 'technical', 'process'],
      weight: 1.0,
      priority: 1,
      category: 'intent-specific'
    }
  ],

  contradiction_stacking: [
    {
      id: 'paradox-exploration',
      name: 'Paradox and Tension Exploration',
      description: 'Introduces contradictory elements for creative thinking',
      apply: (prompt, intent) => {
        if (intent === 'creative' || intent === 'analytical') {
          return `${prompt}\n\nExplore paradoxes, tensions, and contradictory elements to add depth and nuance.`;
        }
        return prompt;
      },
      triggers: ['creative', 'paradox', 'tension', 'complex'],
      weight: 0.7,
      priority: 3,
      category: 'intent-specific'
    },
    {
      id: 'opposing-viewpoints',
      name: 'Opposing Viewpoints Integration',
      description: 'Requests consideration of opposing perspectives',
      apply: (prompt, intent) => {
        if (intent === 'analytical' || intent === 'business') {
          return `${prompt}\n\nPresent both supporting and opposing viewpoints to provide a balanced, nuanced perspective.`;
        }
        return prompt;
      },
      triggers: ['analytical', 'debate', 'comparison', 'balance'],
      weight: 0.8,
      priority: 2,
      category: 'intent-specific'
    }
  ],

  time_distortion: [
    {
      id: 'temporal-perspective-analysis',
      name: 'Multi-Temporal Analysis',
      description: 'Adds past, present, and future considerations',
      apply: (prompt, intent) => {
        if (intent === 'business' || intent === 'analytical') {
          return `${prompt}\n\nConsider historical context, current situation, and future implications in your analysis.`;
        }
        return prompt;
      },
      triggers: ['future', 'history', 'evolution', 'timeline'],
      weight: 0.6,
      priority: 3,
      category: 'intent-specific'
    },
    {
      id: 'creative-temporal-layers',
      name: 'Creative Temporal Layering',
      description: 'Adds temporal complexity to creative works',
      apply: (prompt, intent) => {
        if (intent === 'creative') {
          return `${prompt}\n\nWeave together different time periods or temporal perspectives for added depth and intrigue.`;
        }
        return prompt;
      },
      triggers: ['creative', 'story', 'narrative', 'temporal'],
      weight: 0.7,
      priority: 3,
      category: 'intent-specific'
    }
  ],

  context_anchoring: [
    {
      id: 'context-integration',
      name: 'Context Integration Enhancement',
      description: 'Enhances context usage and relevance',
      apply: (prompt, intent, context) => {
        if (context && context.trim()) {
          return `${prompt}\n\nSpecifically reference and integrate the provided context: "${context}" throughout your response.`;
        }
        return prompt;
      },
      triggers: ['context', 'specific', 'reference'],
      weight: 1.0,
      priority: 1,
      category: 'intent-specific'
    },
    {
      id: 'metaphor-anchoring',
      name: 'Metaphor and Symbol Integration',
      description: 'Adds metaphorical anchoring for clarity',
      apply: (prompt, intent) => {
        if (intent === 'creative' || intent === 'instructional') {
          return `${prompt}\n\nUse relevant metaphors, analogies, or symbolic references to enhance understanding and engagement.`;
        }
        return prompt;
      },
      triggers: ['metaphor', 'analogy', 'symbol', 'creative'],
      weight: 0.6,
      priority: 3,
      category: 'intent-specific'
    }
  ],

  self_repairing: [
    {
      id: 'code-error-handling',
      name: 'Code Error Handling Enhancement',
      description: 'Adds error handling and validation instructions',
      apply: (prompt, intent) => {
        if (intent === 'code' || intent === 'technical') {
          return `${prompt}\n\nInclude proper error handling, input validation, and edge case considerations. Add comments explaining potential issues.`;
        }
        return prompt;
      },
      triggers: ['code', 'technical', 'programming'],
      weight: 1.0,
      priority: 1,
      category: 'intent-specific'
    },
    {
      id: 'quality-validation',
      name: 'Quality Assurance Enhancement',
      description: 'Adds quality checking instructions',
      apply: (prompt) => {
        return `${prompt}\n\nValidate your response for accuracy, completeness, and potential issues before finalizing.`;
      },
      triggers: ['quality', 'validation', 'accuracy'],
      weight: 0.9,
      priority: 2,
      category: 'intent-specific'
    }
  ],

  contextual_adaptation: [
    {
      id: 'expertise-level-adaptation',
      name: 'User Expertise Level Adaptation',
      description: 'Adapts response complexity to user level',
      apply: (prompt, intent, context) => {
        const expertiseIndicators = {
          beginner: ['new to', 'learning', 'basic', 'simple'],
          expert: ['advanced', 'complex', 'sophisticated', 'expert']
        };
        
        const text = `${prompt} ${context || ''}`.toLowerCase();
        let level = 'intermediate';
        
        if (expertiseIndicators.beginner.some(indicator => text.includes(indicator))) {
          level = 'beginner';
        } else if (expertiseIndicators.expert.some(indicator => text.includes(indicator))) {
          level = 'expert';
        }
        
        const adaptations = {
          beginner: 'Explain concepts clearly with basic terminology and plenty of examples.',
          intermediate: 'Provide balanced detail with moderate technical depth.',
          expert: 'Use advanced terminology and focus on sophisticated analysis.'
        };
        
        return `${prompt}\n\n${adaptations[level]}`;
      },
      triggers: ['beginner', 'expert', 'advanced', 'simple'],
      weight: 0.8,
      priority: 2,
      category: 'contextual'
    },
    {
      id: 'urgency-adaptation',
      name: 'Temporal Urgency Adaptation',
      description: 'Adapts depth based on urgency indicators',
      apply: (prompt, intent, context) => {
        const urgencyIndicators = ['quick', 'fast', 'urgent', 'brief', 'summary'];
        const text = `${prompt} ${context || ''}`.toLowerCase();
        
        if (urgencyIndicators.some(indicator => text.includes(indicator))) {
          return `${prompt}\n\nProvide a concise, focused response that addresses the key points efficiently.`;
        } else if (text.includes('detailed') || text.includes('comprehensive')) {
          return `${prompt}\n\nProvide a thorough, comprehensive response with extensive detail and analysis.`;
        }
        return prompt;
      },
      triggers: ['quick', 'urgent', 'detailed', 'comprehensive'],
      weight: 0.7,
      priority: 2,
      category: 'contextual'
    }
  ],

  quality_enhancement: [
    {
      id: 'real-world-examples',
      name: 'Real-World Example Integration',
      description: 'Adds concrete examples for clarity',
      apply: (prompt, intent) => {
        if (intent === 'instructional' || intent === 'analytical' || intent === 'business') {
          return `${prompt}\n\nInclude specific, real-world examples to illustrate your points and enhance understanding.`;
        }
        return prompt;
      },
      triggers: ['example', 'illustration', 'concrete', 'practical'],
      weight: 0.8,
      priority: 2,
      category: 'intent-specific'
    },
    {
      id: 'creative-sensory-enhancement',
      name: 'Sensory Description Enhancement',
      description: 'Adds vivid sensory details for creative content',
      apply: (prompt, intent) => {
        if (intent === 'creative') {
          return `${prompt}\n\nInclude vivid sensory descriptions (sight, sound, smell, touch, taste) to create immersive experiences.`;
        }
        return prompt;
      },
      triggers: ['creative', 'story', 'description', 'vivid'],
      weight: 0.7,
      priority: 2,
      category: 'intent-specific'
    }
  ],

  clarity: [
    {
      id: 'clarity-enhancement',
      name: 'Enhanced Clarity',
      description: 'Improve clarity and role definition for all prompts',
      apply: (prompt, intent) => {
        if (!prompt.includes('clear') && !prompt.includes('specific')) {
          return `${prompt}\n\nBe clear and specific in your response.`;
        }
        return prompt;
      },
      triggers: ['clarity', 'clear', 'specific'],
      weight: 0.8,
      priority: 2,
      category: 'universal'
    }
  ],

  structure: [
    {
      id: 'structural-optimization',
      name: 'Structural Optimization',
      description: 'Optimize output structure and logical flow',
      apply: (prompt, intent) => {
        if (!prompt.includes('structure') && !prompt.includes('organize')) {
          return `${prompt}\n\nOrganize your response with clear headers and logical progression.`;
        }
        return prompt;
      },
      triggers: ['structure', 'organize', 'flow'],
      weight: 0.7,
      priority: 2,
      category: 'universal'
    }
  ],

  context: [
    {
      id: 'contextual-integration',
      name: 'Contextual Integration',
      description: 'Integrate relevant context and background information',
      apply: (prompt, intent, context) => {
        if (context && !prompt.includes('context')) {
          return `${prompt}\n\nProvide necessary background and situational context based on: ${context}`;
        }
        return prompt;
      },
      triggers: ['context', 'background', 'situation'],
      weight: 0.9,
      priority: 1,
      category: 'contextual'
    }
  ],

  validation: [
    {
      id: 'validation-framework',
      name: 'Validation Framework',
      description: 'Include verification and quality assurance measures',
      apply: (prompt) => {
        if (!prompt.includes('validate') && !prompt.includes('verify')) {
          return `${prompt}\n\nAdd checkpoints and validation criteria throughout your process.`;
        }
        return prompt;
      },
      triggers: ['validate', 'verify', 'check', 'quality'],
      weight: 0.8,
      priority: 2,
      category: 'intent-specific'
    }
  ],

  creativity: [
    {
      id: 'structured-creativity',
      name: 'Structured Creativity',
      description: 'Apply creative approaches within systematic frameworks',
      apply: (prompt, intent) => {
        if (intent === 'creative' && !prompt.includes('creative')) {
          return `${prompt}\n\nUse creative techniques while maintaining technical precision and systematic approach.`;
        }
        return prompt;
      },
      triggers: ['creative', 'innovative', 'artistic'],
      weight: 0.7,
      priority: 2,
      category: 'intent-specific'
    }
  ]
};

function getExpertRoleForIntent(intent: IntentType): string {
  const roles = {
    instructional: 'You are an expert educator and master instructor.',
    code: 'You are a senior software engineer with deep technical expertise.',
    analytical: 'You are a critical thinking expert and professional analyst.',
    creative: 'You are a master creative professional with artistic expertise.',
    business: 'You are a seasoned business strategist and management consultant.',
    technical: 'You are a principal architect with extensive technical knowledge.',
    conversational: 'You are a knowledgeable and engaging expert assistant.',
    unknown: 'You are a helpful expert assistant with broad knowledge.'
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

    // Sort heuristics by priority (universal first, then by priority number)
    const sortedHeuristics = heuristics.sort((a, b) => {
      const aRules = HEURISTIC_RULES[a] || [];
      const bRules = HEURISTIC_RULES[b] || [];
      const aPriority = aRules.length > 0 ? Math.min(...aRules.map(r => r.priority)) : 999;
      const bPriority = bRules.length > 0 ? Math.min(...bRules.map(r => r.priority)) : 999;
      return aPriority - bPriority;
    });

    sortedHeuristics.forEach(heuristicType => {
      const rules = HEURISTIC_RULES[heuristicType] || [];
      
      rules.forEach(rule => {
        const shouldApply = this.shouldApplyRule(rule, enhancedPrompt, intent, context);
        
        if (shouldApply) {
          const originalPrompt = enhancedPrompt;
          enhancedPrompt = rule.apply(enhancedPrompt, intent, context);
          
          applications.push({
            heuristic: heuristicType,
            rule,
            applied: enhancedPrompt !== originalPrompt,
            reason: `Applied ${rule.category} rule: ${rule.name}`
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
    
    // Universal rules always apply
    if (rule.category === 'universal') {
      return true;
    }
    
    // Check if any triggers match
    const triggerMatch = rule.triggers.some(trigger => 
      text.includes(trigger) || intent === trigger
    );
    
    // Contextual rules need trigger match or high weight
    if (rule.category === 'contextual') {
      return triggerMatch || Math.random() < rule.weight * 0.4;
    }
    
    // Intent-specific rules apply based on triggers and weight
    return triggerMatch || Math.random() < rule.weight * 0.3;
  }

  static getAvailableHeuristics(): HeuristicType[] {
    return Object.keys(HEURISTIC_RULES) as HeuristicType[];
  }

  static getHeuristicRules(heuristic: HeuristicType): HeuristicRule[] {
    return HEURISTIC_RULES[heuristic] || [];
  }

  static getUniversalHeuristics(): HeuristicType[] {
    return ['universal_clarity', 'format_optimization'] as HeuristicType[];
  }

  static getContextualHeuristics(): HeuristicType[] {
    return ['contextual_adaptation', 'quality_enhancement'] as HeuristicType[];
  }
}
