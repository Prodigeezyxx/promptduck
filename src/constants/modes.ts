
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
    name: 'Lovable',
    description: 'Optimized for Lovable.dev web development',
    icon: '💜',
    color: 'bg-purple-500',
    targetPlatform: 'Lovable.dev',
    heuristics: ['universal_clarity', 'format_optimization', 'quality_enhancement', 'self_repairing'],
    contextInjection: [
      'Focus on React + TypeScript + Tailwind CSS',
      'Emphasize responsive design',
      'Include component structure',
      'Consider mobile-first approach',
      'Mention shadcn/ui components when relevant'
    ],
    formatRules: [
      'Start with clear feature description',
      'Break down into components',
      'Specify styling requirements',
      'Include responsive behavior',
      'Mention accessibility considerations'
    ],
    systemPromptModifier: `Generate prompts optimized for Lovable.dev web development. Focus on:
- React + TypeScript patterns
- Tailwind CSS styling
- Responsive, mobile-first design
- shadcn/ui component usage
- Modern web development practices
- Clear component breakdown
- Accessibility considerations`,
    examples: [
      'Build a responsive dashboard with charts',
      'Create a mobile-first landing page',
      'Design a form with validation'
    ],
    benefits: [
      'Lovable-specific optimization',
      'React/TypeScript focused',
      'Mobile-responsive emphasis',
      'Component-driven structure'
    ]
  },
  replit: {
    id: 'replit',
    name: 'Replit',
    description: 'Educational and beginner-friendly development',
    icon: '🎓',
    color: 'bg-green-500',
    targetPlatform: 'Replit',
    heuristics: ['universal_clarity', 'structure', 'contextual_adaptation', 'quality_enhancement'],
    contextInjection: [
      'Emphasize learning and education',
      'Provide step-by-step explanations',
      'Include beginner-friendly context',
      'Focus on interactive examples',
      'Encourage experimentation'
    ],
    formatRules: [
      'Start with learning objectives',
      'Break into digestible steps',
      'Include code explanations',
      'Add interactive elements',
      'Provide extension challenges'
    ],
    systemPromptModifier: `Generate educational prompts optimized for Replit development. Focus on:
- Beginner-friendly explanations
- Step-by-step learning approach
- Interactive code examples
- Multiple programming languages
- Clear concept explanations
- Hands-on practice exercises
- Progressive complexity`,
    examples: [
      'Learn Python basics with interactive exercises',
      'Build a simple web scraper with explanations',
      'Create a CLI tool step-by-step'
    ],
    benefits: [
      'Educational focus',
      'Beginner-friendly',
      'Interactive learning',
      'Multi-language support'
    ]
  },
  bolt: {
    id: 'bolt',
    name: 'Bolt',
    description: 'Full-stack, production-ready development',
    icon: '⚡',
    color: 'bg-yellow-500',
    targetPlatform: 'Bolt.new',
    heuristics: ['universal_clarity', 'format_optimization', 'self_repairing', 'multi_role_collision'],
    contextInjection: [
      'Focus on full-stack architecture',
      'Emphasize production readiness',
      'Include deployment considerations',
      'Consider scalability and performance',
      'Mention security best practices'
    ],
    formatRules: [
      'Define full application architecture',
      'Specify frontend and backend requirements',
      'Include database schema if needed',
      'Mention deployment strategy',
      'Consider environment configuration'
    ],
    systemPromptModifier: `Generate prompts optimized for Bolt.new full-stack development. Focus on:
- Complete application architecture
- Production-ready code patterns
- Full-stack integration
- Database design and implementation
- API development and testing
- Deployment and DevOps considerations
- Security and performance optimization
- Scalable code structure`,
    examples: [
      'Build a full-stack e-commerce platform',
      'Create a real-time chat application',
      'Develop a SaaS dashboard with authentication'
    ],
    benefits: [
      'Full-stack optimization',
      'Production-ready focus',
      'Architecture guidance',
      'Deployment considerations'
    ]
  }
};

export const DEFAULT_MODE: ModeType = 'general';

export function getModeById(id: ModeType) {
  return MODES[id];
}

export function getAllModes() {
  return Object.values(MODES);
}
