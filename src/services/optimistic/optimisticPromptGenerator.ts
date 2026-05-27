
import { ModeType, HeuristicType } from '@/types';
import { selectHeuristics } from '@/utils/heuristicSelector';
import { MODES } from '@/constants/modes';

export interface OptimisticPrediction {
  intent: string;
  heuristics: string[];
  prompt: string;
  confidence: number;
}

export function getIntentPrediction(intent: string): string {
  if (!intent?.trim()) return "Analyzing your request...";
  
  const cleanIntent = intent.trim().toLowerCase();
  
  if (cleanIntent.includes('app') || cleanIntent.includes('website')) {
    return "Detected: Application/Website development request";
  } else if (cleanIntent.includes('code') || cleanIntent.includes('function')) {
    return "Detected: Code generation/programming task";
  } else if (cleanIntent.includes('write') || cleanIntent.includes('content')) {
    return "Detected: Content creation request";
  } else if (cleanIntent.includes('analyze') || cleanIntent.includes('review')) {
    return "Detected: Analysis/Review task";
  }
  
  return `Detected: ${intent.slice(0, 50)}${intent.length > 50 ? '...' : ''}`;
}

export function getHeuristicsPrediction(intent: string): string[] {
  const heuristics = selectHeuristics(intent);
  return heuristics.map(h => {
    switch (h) {
      case 'universal_clarity': return "✓ Universal Clarity Enhancement";
      case 'format_optimization': return "✓ Format Optimization";
      case 'multi_role_collision': return "✓ Multi-Role Collision";
      case 'self_repairing': return "✓ Self-Repairing Logic";
      case 'contextual_adaptation': return "✓ Contextual Adaptation";
      default: return `✓ ${h.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
    }
  });
}

export function getOptimisticPrompt(intent: string, context: string, mode: ModeType): string {
  if (!intent?.trim()) return "Building your prompt...";
  
  const modeConfig = MODES[mode];
  const isBuilderMode = mode === 'builder';
  
  if (isBuilderMode && (intent.toLowerCase().includes('app') || intent.toLowerCase().includes('create'))) {
    return `Context: You are an expert AI Builder in React, TypeScript, and modern web development.

Task: Create a ${intent.includes('app') ? 'full-stack application' : 'web application'} based on the user's requirements.

Guidelines:
- Use Next.js 14 with App Router and React Server Components
- Implement TypeScript for type safety
- Style with Tailwind CSS and shadcn/ui components
- Set up Supabase for backend functionality
- Ensure mobile-first responsive design

Constraints:
- Follow WCAG-AA accessibility standards
- Optimize for performance and user experience
- Include proper error handling and loading states

Output: [Generating detailed implementation plan...]`;
  }
  
  // General prompt structure based on intent
  const template = `You are an expert assistant specialized in ${getTaskType(intent)}.

Your task is to ${intent.toLowerCase().startsWith('create') || intent.toLowerCase().startsWith('build') ? 'create' : 'help with'} ${intent.toLowerCase()}.

${context ? `Context: ${context}` : ''}

Please provide a comprehensive response that:
- Addresses the specific requirements
- Follows best practices
- Includes practical examples
- Is clear and actionable

[Optimizing with cognitive heuristics...]`;

  return template;
}

function getTaskType(intent: string): string {
  const text = intent.toLowerCase();
  
  if (text.includes('code') || text.includes('program') || text.includes('function')) {
    return 'programming and software development';
  } else if (text.includes('write') || text.includes('content') || text.includes('article')) {
    return 'content creation and writing';
  } else if (text.includes('design') || text.includes('ui') || text.includes('ux')) {
    return 'design and user experience';
  } else if (text.includes('analyze') || text.includes('review') || text.includes('research')) {
    return 'analysis and research';
  } else if (text.includes('marketing') || text.includes('business')) {
    return 'business strategy and marketing';
  }
  
  return 'problem-solving and task completion';
}

export function calculateConfidence(intent: string, context: string): number {
  let confidence = 0.3; // Base confidence
  
  if (intent?.length > 10) confidence += 0.2;
  if (context?.length > 0) confidence += 0.2;
  if (intent?.includes('specific') || intent?.includes('detailed')) confidence += 0.1;
  if (intent && context && intent.length > 20 && context.length > 20) confidence += 0.2;
  
  return Math.min(confidence, 0.9); // Cap at 90%
}
