
import { HeuristicType } from '@/types';

export interface IntentAnalysis {
  primaryIntent: IntentType;
  confidence: number;
  secondaryIntents: IntentType[];
  suggestedHeuristics: HeuristicType[];
  complexity: 'simple' | 'intermediate' | 'advanced';
}

export type IntentType = 
  | 'instructional'
  | 'code'
  | 'analytical'
  | 'creative'
  | 'conversational'
  | 'business'
  | 'technical'
  | 'unknown';

interface IntentPattern {
  keywords: string[];
  phrases: string[];
  contexts: string[];
  weight: number;
  heuristics: HeuristicType[];
  complexity: 'simple' | 'intermediate' | 'advanced';
}

const INTENT_PATTERNS: Record<IntentType, IntentPattern> = {
  instructional: {
    keywords: ['write', 'plan', 'how to', 'guide', 'strategy', 'steps', 'tutorial', 'explain how'],
    phrases: ['show me how', 'teach me', 'step by step', 'walk me through'],
    contexts: ['education', 'learning', 'process', 'method'],
    weight: 1.0,
    heuristics: ['multi_role_collision', 'recursive_refinement'],
    complexity: 'intermediate'
  },
  code: {
    keywords: ['code', 'script', 'function', 'program', 'debug', 'implement', 'algorithm'],
    phrases: ['write a function', 'create a script', 'build a program'],
    contexts: ['programming', 'development', 'software', 'technical'],
    weight: 1.0,
    heuristics: ['self_repairing', 'recursive_refinement'],
    complexity: 'advanced'
  },
  analytical: {
    keywords: ['analyze', 'compare', 'evaluate', 'assess', 'research', 'study'],
    phrases: ['break down', 'deep dive', 'pros and cons', 'what are the'],
    contexts: ['analysis', 'research', 'comparison', 'evaluation'],
    weight: 1.0,
    heuristics: ['multi_role_collision', 'contradiction_stacking'],
    complexity: 'advanced'
  },
  creative: {
    keywords: ['create', 'story', 'poem', 'creative', 'imagine', 'brainstorm', 'design'],
    phrases: ['come up with', 'think of', 'generate ideas'],
    contexts: ['writing', 'art', 'creativity', 'storytelling'],
    weight: 1.0,
    heuristics: ['contradiction_stacking', 'time_distortion', 'context_anchoring'],
    complexity: 'intermediate'
  },
  conversational: {
    keywords: ['chat', 'talk', 'discuss', 'conversation', 'dialogue'],
    phrases: ['let\'s talk about', 'have a conversation'],
    contexts: ['social', 'discussion', 'informal'],
    weight: 0.8,
    heuristics: ['context_anchoring'],
    complexity: 'simple'
  },
  business: {
    keywords: ['business', 'strategy', 'marketing', 'sales', 'revenue', 'growth'],
    phrases: ['business plan', 'go to market', 'competitive analysis'],
    contexts: ['commercial', 'enterprise', 'corporate'],
    weight: 1.0,
    heuristics: ['multi_role_collision', 'recursive_refinement'],
    complexity: 'advanced'
  },
  technical: {
    keywords: ['system', 'architecture', 'infrastructure', 'technical', 'engineering'],
    phrases: ['system design', 'technical solution', 'architecture diagram'],
    contexts: ['technology', 'engineering', 'systems'],
    weight: 1.0,
    heuristics: ['self_repairing', 'multi_role_collision'],
    complexity: 'advanced'
  },
  unknown: {
    keywords: [],
    phrases: [],
    contexts: [],
    weight: 0.0,
    heuristics: ['multi_role_collision'],
    complexity: 'intermediate'
  }
};

export class IntentDetectionEngine {
  static analyzeIntent(userInput: string, context?: string): IntentAnalysis {
    const text = `${userInput} ${context || ''}`.toLowerCase();
    const scores = new Map<IntentType, number>();
    
    // Initialize scores
    Object.keys(INTENT_PATTERNS).forEach(intent => {
      scores.set(intent as IntentType, 0);
    });

    // Score based on patterns
    Object.entries(INTENT_PATTERNS).forEach(([intent, pattern]) => {
      let patternScore = 0;
      
      // Check keywords
      pattern.keywords.forEach(keyword => {
        if (text.includes(keyword)) {
          patternScore += pattern.weight;
        }
      });
      
      // Check phrases (higher weight)
      pattern.phrases.forEach(phrase => {
        if (text.includes(phrase)) {
          patternScore += pattern.weight * 1.5;
        }
      });
      
      // Check contexts
      pattern.contexts.forEach(contextWord => {
        if (text.includes(contextWord)) {
          patternScore += pattern.weight * 0.5;
        }
      });
      
      scores.set(intent as IntentType, patternScore);
    });

    // Find primary intent
    const sortedIntents = Array.from(scores.entries())
      .sort(([,a], [,b]) => b - a);
    
    const primaryIntent = sortedIntents[0][0];
    const maxScore = sortedIntents[0][1];
    
    // Calculate confidence (0-1)
    const confidence = Math.min(maxScore / 3, 1);
    
    // Find secondary intents (with score > 0 and not primary)
    const secondaryIntents = sortedIntents
      .slice(1)
      .filter(([, score]) => score > 0)
      .slice(0, 2)
      .map(([intent]) => intent);

    // Get pattern for primary intent
    const primaryPattern = INTENT_PATTERNS[primaryIntent] || INTENT_PATTERNS.unknown;

    return {
      primaryIntent,
      confidence,
      secondaryIntents,
      suggestedHeuristics: primaryPattern.heuristics,
      complexity: primaryPattern.complexity
    };
  }

  static getIntentDescription(intent: IntentType): string {
    const descriptions: Record<IntentType, string> = {
      instructional: 'Teaching or explaining how to do something',
      code: 'Programming, development, or technical implementation',
      analytical: 'Analysis, research, or evaluation tasks',
      creative: 'Creative writing, brainstorming, or artistic tasks',
      conversational: 'Casual conversation or discussion',
      business: 'Business strategy, marketing, or commercial tasks',
      technical: 'System design, architecture, or engineering',
      unknown: 'Intent unclear or mixed'
    };
    
    return descriptions[intent] || 'Unknown intent type';
  }
}
