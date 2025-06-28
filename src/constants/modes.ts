
import { ModeConfiguration, ModeType } from '@/types';

export const MODES: ModeConfiguration = {
  general: {
    id: 'general',
    name: 'General',
    description: 'Versatile prompts for any AI tool or context',
    icon: '🎯',
    color: 'bg-gray-500',
    targetPlatform: 'Any AI Platform',
    heuristics: ['universal_clarity', 'format_optimization', 'contextual_adaptation'],
    contextInjection: [
      'Maintain broad applicability',
      'Focus on clear communication',
      'Provide structured output'
    ],
    formatRules: [
      'Use clear, concise language',
      'Structure with headers and bullet points',
      'Include examples when helpful'
    ],
    systemPromptModifier: 'Generate versatile, well-structured prompts suitable for any AI platform.',
    examples: [
      'Content creation prompts',
      'Analysis and research tasks',
      'Creative writing assistance'
    ],
    benefits: [
      'Works with any AI tool',
      'Balanced complexity',
      'Clear structure'
    ]
  },
  lovable: {
    id: 'lovable',
    name: 'Lovable Transformer',
    description: 'Advanced prompt engineering engine for Lovable.dev with intelligent intent classification',
    icon: '🧠',
    color: 'bg-purple-500',
    targetPlatform: 'Lovable.dev',
    heuristics: ['universal_clarity', 'format_optimization', 'quality_enhancement', 'self_repairing', 'multi_role_collision'],
    contextInjection: [
      'Apply intelligent intent classification (New Project, UI/Design, Code Refactoring, Debugging, Feature Addition)',
      'Use template augmentation based on detected intent',
      'Focus on React + TypeScript + Tailwind CSS patterns',
      'Emphasize responsive, mobile-first design',
      'Include component structure and shadcn/ui usage',
      'Apply safety rails to prevent breaking functionality',
      'Generate structured, copy-paste-ready markdown blocks'
    ],
    formatRules: [
      'Classify user intent before generating prompts',
      'Apply corresponding best-practice templates',
      'Structure output as actionable, self-contained blocks',
      'Include clear constraints and guidelines',
      'Separate planning from implementation phases',
      'Use chain-of-thought reasoning for debugging tasks'
    ],
    systemPromptModifier: `You are the Lovable Prompt Transformer. Apply advanced prompt engineering:

INTENT CLASSIFICATION ENGINE:
- New Project Scaffolding: Keywords like "build," "create app," "start project"
- UI/Design Modification: Keywords like "style," "responsive," "colors," "layout"  
- Code Refactoring: Keywords like "clean up," "refactor," "organize"
- Debugging: Keywords like "error," "fix," "not working," "bug"
- Feature Addition: Keywords like "add feature," "implement," "change how X works"
- Vague/Ambiguous: Input too broad to be actionable

TEMPLATE AUGMENTATION SYSTEM:
For each intent type, apply structured templates with:
- Context setting and safety constraints
- Step-by-step guidelines with clear objectives
- Lovable-specific best practices (React/TypeScript/Tailwind)
- Risk mitigation and functionality preservation
- Evidence-based solutions with clear explanations

OUTPUT STRUCTURE:
Generate complete, copy-paste-ready prompts with:
- Clear context and task definition
- Specific guidelines tailored to Lovable.dev
- Explicit constraints to prevent breaking changes
- Mobile-first, component-driven approach
- Integration with shadcn/ui and modern patterns`,
    examples: [
      'Transform "build an e-commerce site" into structured project scaffolding',
      'Convert "make it look better" into safe UI enhancement prompts',
      'Turn "fix this bug" into systematic debugging workflows'
    ],
    benefits: [
      'Intelligent intent detection',
      'Template-based prompt engineering',
      'Safety-first approach',
      'Lovable-optimized workflows',
      'Structured, actionable outputs'
    ]
  },
  cursor: {
    id: 'cursor',
    name: 'Cursor AI',
    description: 'AI-powered code editing and intelligent suggestions for IDE workflows',
    icon: '⚡',
    color: 'bg-blue-500',
    targetPlatform: 'Cursor IDE',
    heuristics: ['universal_clarity', 'format_optimization', 'self_repairing'],
    contextInjection: [
      'Focus on AI-assisted code completion',
      'Emphasize intelligent code suggestions',
      'Consider IDE-specific workflows',
      'Include refactoring and optimization hints'
    ],
    formatRules: [
      'Structure for AI code assistance',
      'Include contextual code improvements',
      'Focus on developer productivity',
      'Emphasize code quality and best practices'
    ],
    systemPromptModifier: 'Generate prompts optimized for Cursor AI IDE with focus on intelligent code assistance and developer productivity.',
    examples: [
      'AI-assisted code completion',
      'Intelligent refactoring suggestions',
      'Context-aware code improvements'
    ],
    benefits: [
      'AI-powered code assistance',
      'Intelligent suggestions',
      'IDE integration',
      'Developer productivity focus'
    ],
    isComingSoon: true,
    disabled: true
  },
  midjourney: {
    id: 'midjourney',
    name: 'Midjourney',
    description: 'Visual design prompts and creative image generation workflows',
    icon: '🎨',
    color: 'bg-pink-500',
    targetPlatform: 'Midjourney',
    heuristics: ['creativity', 'format_optimization', 'contextual_adaptation'],
    contextInjection: [
      'Focus on visual design language',
      'Emphasize artistic styles and composition',
      'Include lighting, mood, and aesthetic details',
      'Consider aspect ratios and technical parameters'
    ],
    formatRules: [
      'Structure for image generation',
      'Include style and mood descriptors',
      'Specify technical parameters',
      'Focus on visual storytelling'
    ],
    systemPromptModifier: 'Generate prompts optimized for Midjourney image generation with focus on visual design, artistic styles, and creative composition.',
    examples: [
      'UI mockup generation',
      'Brand identity visuals',
      'Creative design concepts'
    ],
    benefits: [
      'Visual design focus',
      'Creative image generation',
      'Artistic style guidance',
      'Brand identity support'
    ],
    isComingSoon: true,
    disabled: true
  }
};

export const DEFAULT_MODE: ModeType = 'general';

export function getModeById(id: ModeType) {
  return MODES[id];
}

export function getAllModes() {
  return Object.values(MODES);
}
