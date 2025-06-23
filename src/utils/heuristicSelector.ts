
import { HeuristicType } from '@/types';

// Simplified heuristic selection with caching
const HEURISTIC_CACHE = new Map<string, HeuristicType[]>();

export function selectHeuristics(intent: string, context?: string): HeuristicType[] {
  const cacheKey = `${intent}-${context || ''}`;
  
  // Check cache first
  if (HEURISTIC_CACHE.has(cacheKey)) {
    return HEURISTIC_CACHE.get(cacheKey)!;
  }

  // Fast heuristic selection based on keywords
  const text = `${intent} ${context || ''}`.toLowerCase();
  const heuristics: HeuristicType[] = [];

  // Always include universal clarity
  heuristics.push('universal_clarity');

  // Quick keyword-based selection
  if (text.includes('code') || text.includes('program') || text.includes('function')) {
    heuristics.push('format_optimization', 'self_repairing');
  } else if (text.includes('creative') || text.includes('story') || text.includes('idea')) {
    heuristics.push('contradiction_stacking', 'time_distortion');
  } else if (text.includes('analyze') || text.includes('compare') || text.includes('evaluate')) {
    heuristics.push('multi_role_collision', 'recursive_refinement');
  } else {
    heuristics.push('format_optimization', 'contextual_adaptation');
  }

  // Cache result for future use
  HEURISTIC_CACHE.set(cacheKey, heuristics);
  
  return heuristics;
}
