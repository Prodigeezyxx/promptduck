
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
  builder: {
    id: 'builder',
    name: 'Builder Mode',
    description: 'Structured app development prompt engineering with smart intent classification',
    icon: '🧠',
    color: 'bg-purple-500',
    targetPlatform: 'App Development',
    heuristics: ['universal_clarity', 'format_optimization', 'quality_enhancement', 'self_repairing', 'multi_role_collision'],
    contextInjection: [
      'Apply Role → Task → Constraints → Format → Goal structure for maximum effectiveness',
      'Smart app name extraction from natural language (e.g., "called Fren")',
      'Dynamic template generation for 25+ app categories',
      'First-run optimization for phrases like "I want to create a [type] app"',
      'Professional tech stack specifications (Next.js, Supabase, TypeScript)',
      'Complete project scaffolding with schemas, components, and seed data',
      'Production-ready constraints including performance and accessibility'
    ],
    formatRules: [
      'Detect app creation patterns and extract project names automatically',
      'Generate complete Context → Task → Guidelines → Constraints → Output blocks',
      'Include numbered build plans, database schemas, and component trees',
      'Apply specialized templates for dating, health, e-commerce, and other app types',
      'Add smart project naming and feature specification based on user intent'
    ],
    systemPromptModifier: `You are an expert app development prompt engineer with R-T-C-F-G methodology.

ENHANCED APP DETECTION:
- Mental health apps: "telepresence," "therapy," "wellness," "community support"
- Dating apps: "dating," "matching," "swipe," "relationships," "social connection"
- E-commerce: "shopping," "marketplace," "products," "payments," "store"
- Government services: "visa," "applications," "legal," "official processes"
- And 20+ other specialized categories with intelligent pattern matching

SMART NAME EXTRACTION:
- Automatically detect app names from patterns: "called X," "named Y," "app Z"
- Generate contextually appropriate names when none provided
- Adapt templates dynamically based on detected app type and name

R-T-C-F-G TEMPLATE STRUCTURE:
Context: Define role as AI Builder and project scope
Task: Numbered implementation steps with specific technical requirements
Guidelines: Tech stack, design principles, and development standards
Constraints: Performance, accessibility, and resource limitations
Output: Structured deliverables (Plan, Schema, Components, SeedScript, README)
Goal: Production-ready MVP that compiles and provides exceptional UX

BUILDER OPTIMIZATION:
- Modern framework (Next.js, React) with server components
- Supabase for auth, database, and real-time features
- TypeScript, Tailwind CSS, and shadcn/ui integration
- Mobile-first responsive design with WCAG-AA compliance
- Complete project scaffolding from first user input`,
    examples: [
      'Transform "I want to create a mental health app called Fren" into complete R-T-C-F-G template',
      'Convert "dating app with swipe features" into professional project specification',
      'Generate full MVP prompts from brief ideas like "productivity tool for teams"'
    ],
    benefits: [
      'R-T-C-F-G structured templates for maximum clarity',
      'Smart app name and type detection from natural language',
      'First-run optimization for immediate app creation',
      'Professional project scaffolding with complete tech specifications',
      'Production-ready constraints and quality standards'
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
