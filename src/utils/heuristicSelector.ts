
import { HeuristicType } from '@/types';

interface HeuristicPattern {
  keywords: string[];
  contexts: string[];
  heuristics: HeuristicType[];
  weight: number;
}

const HEURISTIC_PATTERNS: HeuristicPattern[] = [
  {
    keywords: ['strategy', 'plan', 'analyze', 'framework', 'system', 'process'],
    contexts: ['business', 'product', 'analysis'],
    heuristics: ['multi_role_collision', 'recursive_refinement'],
    weight: 1.0
  },
  {
    keywords: ['creative', 'story', 'imagine', 'vision', 'dream', 'artistic'],
    contexts: ['content', 'writing', 'design'],
    heuristics: ['contradiction_stacking', 'time_distortion', 'context_anchoring'],
    weight: 1.0
  },
  {
    keywords: ['problem', 'solve', 'fix', 'improve', 'optimize', 'debug'],
    contexts: ['technical', 'engineering', 'troubleshoot'],
    heuristics: ['self_repairing', 'recursive_refinement'],
    weight: 1.0
  },
  {
    keywords: ['learn', 'understand', 'explain', 'teach', 'research'],
    contexts: ['education', 'knowledge', 'academic'],
    heuristics: ['multi_role_collision', 'context_anchoring'],
    weight: 1.0
  },
  {
    keywords: ['future', 'past', 'timeline', 'history', 'evolution', 'trend'],
    contexts: ['temporal', 'forecasting', 'analysis'],
    heuristics: ['time_distortion', 'contradiction_stacking'],
    weight: 1.0
  },
  {
    keywords: ['paradox', 'opposite', 'contrast', 'tension', 'balance'],
    contexts: ['philosophical', 'complex'],
    heuristics: ['contradiction_stacking', 'multi_role_collision'],
    weight: 1.0
  }
];

export function selectHeuristics(intent: string, context?: string): HeuristicType[] {
  const text = `${intent} ${context || ''}`.toLowerCase();
  const scores = new Map<HeuristicType, number>();
  
  // Initialize scores
  const allHeuristics: HeuristicType[] = [
    'multi_role_collision',
    'recursive_refinement', 
    'contradiction_stacking',
    'time_distortion',
    'context_anchoring',
    'self_repairing'
  ];
  
  allHeuristics.forEach(h => scores.set(h, 0));
  
  // Score based on patterns
  HEURISTIC_PATTERNS.forEach(pattern => {
    let patternScore = 0;
    
    // Check keywords
    pattern.keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        patternScore += pattern.weight;
      }
    });
    
    // Check contexts
    pattern.contexts.forEach(contextWord => {
      if (text.includes(contextWord)) {
        patternScore += pattern.weight * 0.5;
      }
    });
    
    // Apply scores to heuristics
    if (patternScore > 0) {
      pattern.heuristics.forEach(heuristic => {
        scores.set(heuristic, (scores.get(heuristic) || 0) + patternScore);
      });
    }
  });
  
  // Always include at least one heuristic
  if (Math.max(...scores.values()) === 0) {
    return ['multi_role_collision', 'recursive_refinement'];
  }
  
  // Select top 2-3 heuristics
  const sortedHeuristics = Array.from(scores.entries())
    .sort(([,a], [,b]) => b - a)
    .filter(([,score]) => score > 0)
    .slice(0, 3)
    .map(([heuristic]) => heuristic);
  
  return sortedHeuristics.length > 0 ? sortedHeuristics : ['multi_role_collision'];
}
