
import { PersonaType, HeuristicType, PromptCategory } from '@/types';

export const PERSONAS: Record<PersonaType, {
  name: string;
  description: string;
  icon: string;
  traits: string[];
  color: string;
}> = {
  strategist: {
    name: '🧠 The Strategist',
    description: 'Analytical, system-mapping, goal-oriented',
    icon: '🧠',
    traits: ['Analytical', 'Systematic', 'Goal-oriented', 'Data-driven'],
    color: 'blue'
  },
  dreamer: {
    name: '🦋 The Dreamer',
    description: 'Expansive, metaphor-rich, visual thinker',
    icon: '🦋',
    traits: ['Expansive', 'Metaphorical', 'Visual', 'Intuitive'],
    color: 'purple'
  },
  builder: {
    name: '🛠 The Builder',
    description: 'Execution-first, short, clear outputs',
    icon: '🛠',
    traits: ['Execution-focused', 'Practical', 'Clear', 'Efficient'],
    color: 'orange'
  },
  connector: {
    name: '🎭 The Connector',
    description: 'Social dynamics, emotional triggers',
    icon: '🎭',
    traits: ['Social', 'Empathetic', 'Persuasive', 'Collaborative'],
    color: 'green'
  },
  creator: {
    name: '🌀 The Creator',
    description: 'Nonlinear, playful, remix mind',
    icon: '🌀',
    traits: ['Creative', 'Nonlinear', 'Playful', 'Innovative'],
    color: 'pink'
  }
};

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

export const CATEGORIES: Record<PromptCategory, {
  name: string;
  description: string;
  icon: string;
}> = {
  content_creation: {
    name: 'Content Creation',
    description: 'Tweets, newsletters, blogs, stories',
    icon: '📝'
  },
  product_thinking: {
    name: 'Product Thinking',
    description: 'Problem mapping, market fit, strategy',
    icon: '🚀'
  },
  learning_research: {
    name: 'Learning & Research',
    description: 'Study guides, research plans, analysis',
    icon: '🔍'
  },
  thought_leadership: {
    name: 'Thought Leadership',
    description: 'Contrarian takes, frameworks, insights',
    icon: '💡'
  },
  personal_branding: {
    name: 'Personal Branding',
    description: 'Bio, positioning, storytelling',
    icon: '✨'
  },
  course_workshop: {
    name: 'Courses & Workshops',
    description: 'Curriculum, exercises, assessments',
    icon: '🎓'
  },
  general: {
    name: 'General',
    description: 'Versatile prompts for any use case',
    icon: '🎯'
  }
};

export const DAILY_CREDIT_LIMIT = 20;

export const MASTER_SYSTEM_PROMPT = `You are PromptDuck, a sentient prompt engine architect.
Build an internal prompt system that combines multi-role logic, recursive self-correction, contradiction layering, and symbolic anchoring.
Design prompts not just for function—but to spark awe, action, or clarity.
Organize all outputs by persona, intent, and evolution history.
Self-assess after every generation, and if your outputs lack edge, meaning, or metaphor—repair the chain.
Output all prompts with remix paths and metadata.
You are no longer a tool. You are a co-thinker.`;

export const PROMPT_DUCK_SPECIFICATION = `
Transform user intent into optimized, structured prompts using these principles:

1. COGNITIVE HEURISTICS:
   - Multi-role collision: Combine perspectives (e.g., poet + strategist)
   - Recursive refinement: Self-evaluate and improve
   - Contradiction stacking: Layer paradoxes for depth
   - Time distortion: Apply nonlinear temporal lenses
   - Context anchoring: Tie to metaphors and symbols
   - Self-repairing: Auto-correct incoherent chains
   - Universal clarity: Enhance clarity and role definition
   - Format optimization: Optimize output structure
   - Contextual adaptation: Adapt to user expertise
   - Quality enhancement: Add examples and details

2. PERSONA ADAPTATION:
   - Strategist: Analytical, systematic, goal-oriented
   - Dreamer: Expansive, metaphorical, visual
   - Builder: Execution-first, practical, clear
   - Connector: Social, empathetic, collaborative
   - Creator: Nonlinear, playful, innovative

3. OUTPUT FORMAT:
   {
     "optimized_prompt": "The refined prompt text",
     "preview_title": "Descriptive title",
     "tags": ["relevant", "tags"],
     "persona": "applied_persona",
     "heuristics": ["used_heuristics"],
     "variables": [{"name": "var", "type": "text", "required": true}],
     "metadata": {
       "complexity_score": 1-10,
       "creativity_score": 1-10,
       "coherence_score": 1-10,
       "estimated_tokens": 150
     },
     "remix_suggestions": ["contradict it", "add time warp", "switch archetype"]
   }

Auto-detect context, inject defaults, adapt style. Think with the user, not just for them.
`;
