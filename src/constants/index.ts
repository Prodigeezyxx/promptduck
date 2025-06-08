
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

export const DAILY_CREDIT_LIMIT = 40;

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

export const SAMPLE_PROMPTS = [
  {
    id: '1',
    title: 'Strategic Content Planning',
    content: 'You are a strategic content planner with the analytical depth of a {role1} and the creative vision of a {role2}. Create a comprehensive content strategy for {topic} that balances {constraint1} with {constraint2}. Consider both immediate impact and long-term positioning.',
    description: 'Multi-role strategic planning for content creation',
    tags: ['strategy', 'content', 'planning'],
    persona: 'strategist' as PersonaType,
    heuristics: ['multi_role_collision', 'contradiction_stacking'] as HeuristicType[],
    variables: [
      { name: 'role1', type: 'text', default: 'data analyst', required: true, description: 'First role perspective' },
      { name: 'role2', type: 'text', default: 'creative director', required: true, description: 'Second role perspective' },
      { name: 'topic', type: 'text', required: true, description: 'Content topic or theme' },
      { name: 'constraint1', type: 'text', default: 'authenticity', required: true, description: 'First constraint' },
      { name: 'constraint2', type: 'text', default: 'scalability', required: true, description: 'Second constraint' }
    ],
    created_at: '2024-06-08T10:00:00Z',
    updated_at: '2024-06-08T10:00:00Z',
    version: 1,
    usage_count: 0,
    category: 'content_creation' as PromptCategory
  },
  {
    id: '2',
    title: 'Dreamer\'s Vision Quest',
    content: 'Imagine you are standing at the intersection of {past_era} and {future_vision}, where {metaphor} guides your understanding. Through the lens of both {emotion1} and {emotion2}, explore how {concept} transforms when viewed as a living, breathing entity that evolves across time.',
    description: 'Time-distorted creative exploration with emotional anchoring',
    tags: ['vision', 'creativity', 'time', 'metaphor'],
    persona: 'dreamer' as PersonaType,
    heuristics: ['time_distortion', 'context_anchoring', 'contradiction_stacking'] as HeuristicType[],
    variables: [
      { name: 'past_era', type: 'text', default: 'Renaissance', required: true, description: 'Historical period' },
      { name: 'future_vision', type: 'text', default: '2050', required: true, description: 'Future timeframe' },
      { name: 'metaphor', type: 'text', default: 'flowing river', required: true, description: 'Guiding metaphor' },
      { name: 'emotion1', type: 'text', default: 'wonder', required: true, description: 'First emotion' },
      { name: 'emotion2', type: 'text', default: 'determination', required: true, description: 'Second emotion' },
      { name: 'concept', type: 'text', required: true, description: 'Core concept to explore' }
    ],
    created_at: '2024-06-08T10:30:00Z',
    updated_at: '2024-06-08T10:30:00Z',
    version: 1,
    usage_count: 0,
    category: 'learning_research' as PromptCategory
  },
  {
    id: '3',
    title: 'Builder\'s Action Framework',
    content: 'Break down {goal} into concrete, executable steps. For each step, identify: 1) Required resources, 2) Success metrics, 3) Risk mitigation, 4) Timeline. Prioritize actions that deliver {value_type} while maintaining {quality_standard}. Keep everything actionable and measurable.',
    description: 'Practical execution framework for builders',
    tags: ['execution', 'framework', 'planning', 'action'],
    persona: 'builder' as PersonaType,
    heuristics: ['recursive_refinement'] as HeuristicType[],
    variables: [
      { name: 'goal', type: 'text', required: true, description: 'Main objective to achieve' },
      { name: 'value_type', type: 'select', options: ['immediate value', 'long-term value', 'learning value'], default: 'immediate value', required: true, description: 'Type of value to prioritize' },
      { name: 'quality_standard', type: 'text', default: 'high quality', required: true, description: 'Quality benchmark' }
    ],
    created_at: '2024-06-08T11:00:00Z',
    updated_at: '2024-06-08T11:00:00Z',
    version: 1,
    usage_count: 0,
    category: 'product_thinking' as PromptCategory
  }
];
