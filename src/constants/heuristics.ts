
import { HeuristicType } from '@/types';

export const HEURISTICS: Record<HeuristicType, {
  name: string;
  description: string;
  example: string;
}> = {
  multi_role_collision: {
    name: 'Multi-Role Collision',
    description: 'Combine multiple roles for unique perspectives',
    example: 'poet + strategist + historian'
  },
  recursive_refinement: {
    name: 'Recursive Refinement',
    description: 'Self-evaluating and improving prompts',
    example: 'Continuously refine based on coherence'
  },
  contradiction_stacking: {
    name: 'Contradiction Stacking',
    description: 'Layer paradoxes for depth',
    example: 'playful but serious, chaotic yet structured'
  },
  time_distortion: {
    name: 'Time Distortion',
    description: 'Nonlinear temporal perspectives',
    example: 'past-future mashups'
  },
  context_anchoring: {
    name: 'Context Anchoring',
    description: 'Tie to metaphors and symbolic anchors',
    example: 'Using nature metaphors for growth concepts'
  },
  self_repairing: {
    name: 'Self-Repairing',
    description: 'Auto-correct incoherent prompt chains',
    example: 'Detect low signal and repair mid-flow'
  },
  universal_clarity: {
    name: 'Universal Clarity',
    description: 'Enhance clarity and role definition for all prompts',
    example: 'Add expert roles and clarify ambiguous terms'
  },
  format_optimization: {
    name: 'Format Optimization',
    description: 'Optimize output structure and formatting',
    example: 'Specify numbered lists, headers, and clear structure'
  },
  contextual_adaptation: {
    name: 'Contextual Adaptation',
    description: 'Adapt to user expertise and urgency levels',
    example: 'Adjust complexity for beginners vs experts'
  },
  quality_enhancement: {
    name: 'Quality Enhancement',
    description: 'Add examples, sensory details, and practical elements',
    example: 'Include real-world examples and vivid descriptions'
  }
};
