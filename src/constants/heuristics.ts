
import { HeuristicType } from '@/types';

export const HEURISTICS: Record<HeuristicType, {
  name: string;
  description: string;
  example: string;
}> = {
  universal_clarity: {
    name: 'Universal Clarity Enhancement',
    description: 'Rephrase ambiguous terms into specific, concrete instructions',
    example: 'Replace "make it better" with "improve readability by using shorter sentences and bullet points"'
  },
  format_optimization: {
    name: 'Format Optimization',
    description: 'Specify output structure and formatting requirements',
    example: 'Structure response as: 1) Overview, 2) Step-by-step process, 3) Expected outcomes'
  },
  multi_role_collision: {
    name: 'Multi-Role Collision',
    description: 'Combine multiple expert perspectives for comprehensive analysis',
    example: 'Approach as both technical architect and business strategist'
  },
  recursive_refinement: {
    name: 'Recursive Refinement',
    description: 'Self-evaluating and iterative improvement instructions',
    example: 'Review output for completeness, then refine for technical accuracy'
  },
  contradiction_stacking: {
    name: 'Contradiction Stacking',
    description: 'Layer paradoxes and opposing viewpoints for depth',
    example: 'Consider both rapid implementation and thorough testing approaches'
  },
  time_distortion: {
    name: 'Temporal Analysis',
    description: 'Apply historical context and future implications perspective',
    example: 'Analyze current trends, historical precedents, and future projections'
  },
  context_anchoring: {
    name: 'Context Anchoring',
    description: 'Tie responses to specific contextual frameworks and examples',
    example: 'Ground abstract concepts in concrete, industry-specific examples'
  },
  self_repairing: {
    name: 'Self-Repairing Logic',
    description: 'Include error detection and correction mechanisms',
    example: 'Add validation steps and common error prevention measures'
  },
  contextual_adaptation: {
    name: 'Contextual Adaptation',
    description: 'Adapt complexity and approach based on user expertise level',
    example: 'Adjust technical depth for beginner vs expert audience'
  },
  quality_enhancement: {
    name: 'Quality Enhancement',
    description: 'Add examples, real-world applications, and practical elements',
    example: 'Include specific use cases, code examples, and implementation details'
  },
  clarity: {
    name: 'Enhanced Clarity',
    description: 'Improve clarity and role definition for all prompts',
    example: 'Define expert roles and clarify ambiguous terms'
  },
  structure: {
    name: 'Structural Optimization',
    description: 'Optimize output structure and logical flow',
    example: 'Organize content with clear headers and logical progression'
  },
  context: {
    name: 'Contextual Integration',
    description: 'Integrate relevant context and background information',
    example: 'Provide necessary background and situational context'
  },
  validation: {
    name: 'Validation Framework',
    description: 'Include verification and quality assurance measures',
    example: 'Add checkpoints and validation criteria throughout process'
  },
  creativity: {
    name: 'Structured Creativity',
    description: 'Apply creative approaches within systematic frameworks',
    example: 'Use creative techniques while maintaining technical precision'
  }
};
