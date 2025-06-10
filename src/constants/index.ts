
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

export const SAMPLE_PROMPTS = [
  {
    id: '1',
    title: 'Strategic Content Planner',
    content: 'You are a strategic content planner combining the analytical depth of a {role1} and the creative vision of a {role2}. Create a comprehensive content strategy for {topic} that balances {constraint1} with {constraint2}. Include: 1) Content pillars and themes, 2) Platform-specific adaptations, 3) Engagement tactics, 4) Success metrics, 5) Risk mitigation strategies. Consider both immediate impact and long-term brand positioning.',
    description: 'Multi-role strategic planning for social media, blogs, and email marketing',
    tags: ['strategy', 'content', 'planning'],
    persona: 'strategist' as PersonaType,
    heuristics: ['multi_role_collision', 'contradiction_stacking', 'universal_clarity'] as HeuristicType[],
    variables: [
      { name: 'role1', type: 'text' as const, default: 'data analyst', required: true, description: 'First role perspective (e.g., data analyst, psychologist)' },
      { name: 'role2', type: 'text' as const, default: 'creative director', required: true, description: 'Second role perspective (e.g., creative director, brand strategist)' },
      { name: 'topic', type: 'text' as const, required: true, description: 'Content topic or brand theme' },
      { name: 'constraint1', type: 'text' as const, default: 'authenticity', required: true, description: 'First constraint (e.g., authenticity, budget)' },
      { name: 'constraint2', type: 'text' as const, default: 'scalability', required: true, description: 'Second constraint (e.g., scalability, brand guidelines)' }
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
    content: 'Imagine you are standing at the intersection of {past_era} and {future_vision}, where {metaphor} guides your understanding. Through the lens of both {emotion1} and {emotion2}, explore how {concept} transforms when viewed as a living, breathing entity that evolves across time. Create a visionary narrative that: 1) Bridges temporal perspectives, 2) Uses rich sensory language, 3) Incorporates paradoxes and contradictions, 4) Inspires action through emotional resonance.',
    description: 'Creative, emotional ideation for artists, writers, and founders using time-distorted exploration',
    tags: ['vision', 'creativity', 'time'],
    persona: 'dreamer' as PersonaType,
    heuristics: ['time_distortion', 'context_anchoring', 'contradiction_stacking', 'quality_enhancement'] as HeuristicType[],
    variables: [
      { name: 'past_era', type: 'text' as const, default: 'Renaissance', required: true, description: 'Historical period for perspective' },
      { name: 'future_vision', type: 'text' as const, default: '2050', required: true, description: 'Future timeframe or vision' },
      { name: 'metaphor', type: 'text' as const, default: 'flowing river', required: true, description: 'Guiding metaphor or symbol' },
      { name: 'emotion1', type: 'text' as const, default: 'wonder', required: true, description: 'First emotional lens' },
      { name: 'emotion2', type: 'text' as const, default: 'determination', required: true, description: 'Second emotional lens' },
      { name: 'concept', type: 'text' as const, required: true, description: 'Core concept to explore and transform' }
    ],
    created_at: '2024-06-08T10:30:00Z',
    updated_at: '2024-06-08T10:30:00Z',
    version: 1,
    usage_count: 0,
    category: 'thought_leadership' as PromptCategory
  },
  {
    id: '3',
    title: 'Builder\'s Action Framework',
    content: 'Break down {goal} into concrete, executable steps that deliver {value_type} while maintaining {quality_standard}. For each step, provide: 1) Required resources and dependencies, 2) Clear success metrics and checkpoints, 3) Risk mitigation strategies, 4) Realistic timeline estimates, 5) Decision points and alternatives. Prioritize actions based on impact vs. effort. Keep everything actionable, measurable, and immediately implementable.',
    description: 'Break big ideas into practical execution steps for early-stage founders and doers',
    tags: ['execution', 'framework', 'planning'],
    persona: 'builder' as PersonaType,
    heuristics: ['recursive_refinement', 'format_optimization', 'contextual_adaptation'] as HeuristicType[],
    variables: [
      { name: 'goal', type: 'text' as const, required: true, description: 'Main objective or project to break down' },
      { name: 'value_type', type: 'select' as const, options: ['immediate value', 'long-term value', 'learning value', 'revenue value'], default: 'immediate value', required: true, description: 'Type of value to prioritize' },
      { name: 'quality_standard', type: 'text' as const, default: 'high quality', required: true, description: 'Quality benchmark or standard to maintain' }
    ],
    created_at: '2024-06-08T11:00:00Z',
    updated_at: '2024-06-08T11:00:00Z',
    version: 1,
    usage_count: 0,
    category: 'product_thinking' as PromptCategory
  },
  {
    id: '4',
    title: 'Prompt Optimizer',
    content: 'You are a meta-prompt engineer. Analyze and improve the following prompt: "{original_prompt}". Apply these optimization techniques: 1) Clarity enhancement - remove ambiguity and add specificity, 2) Structure optimization - organize for better flow and comprehension, 3) Context enrichment - add relevant background and constraints, 4) Output formatting - specify desired response structure, 5) Variable integration - identify opportunities for customization. Provide the optimized prompt along with explanation of improvements made.',
    description: 'Improve any prompt with heuristics and formatting rules - meta-prompting for PromptDuck',
    tags: ['meta', 'prompt-engineering', 'improvement'],
    persona: 'creator' as PersonaType,
    heuristics: ['recursive_refinement', 'universal_clarity', 'format_optimization', 'self_repairing'] as HeuristicType[],
    variables: [
      { name: 'original_prompt', type: 'textarea' as const, required: true, description: 'The prompt you want to optimize and improve' }
    ],
    created_at: '2024-06-08T11:30:00Z',
    updated_at: '2024-06-08T11:30:00Z',
    version: 1,
    usage_count: 0,
    category: 'general' as PromptCategory
  },
  {
    id: '5',
    title: 'Agent Personality Creator',
    content: 'Design a unique AI agent with the personality archetype of {archetype} combined with traits from {secondary_traits}. Define: 1) Core personality attributes and behavioral patterns, 2) Communication style and tone preferences, 3) Decision-making approach and problem-solving methods, 4) Strengths, limitations, and blind spots, 5) Interaction protocols and response patterns. Create a comprehensive agent persona that feels authentic and consistent across different scenarios.',
    description: 'Create persona-driven AI agents with custom traits and behavior patterns',
    tags: ['agent', 'personality', 'AI'],
    persona: 'connector' as PersonaType,
    heuristics: ['multi_role_collision', 'context_anchoring', 'quality_enhancement'] as HeuristicType[],
    variables: [
      { name: 'archetype', type: 'select' as const, options: ['mentor', 'innovator', 'analyst', 'diplomat', 'rebel', 'caregiver'], default: 'mentor', required: true, description: 'Primary personality archetype' },
      { name: 'secondary_traits', type: 'text' as const, default: 'curiosity and precision', required: true, description: 'Additional personality traits to blend in' }
    ],
    created_at: '2024-06-08T12:00:00Z',
    updated_at: '2024-06-08T12:00:00Z',
    version: 1,
    usage_count: 0,
    category: 'personal_branding' as PromptCategory
  },
  {
    id: '6',
    title: 'Expert Explainer',
    content: 'Transform the complex concept "{complex_concept}" into a clear, engaging explanation for {audience_level}. Use: 1) Analogies and metaphors that relate to {familiar_domain}, 2) Progressive complexity - start simple, build understanding, 3) Concrete examples and real-world applications, 4) Visual language that paints mental pictures, 5) Interactive elements or thought experiments. Make the explanation memorable, actionable, and inspiring while maintaining accuracy.',
    description: 'Convert any complex idea into simplified, clear explanations for students, researchers, and professionals',
    tags: ['education', 'explain', 'clarity'],
    persona: 'strategist' as PersonaType,
    heuristics: ['contextual_adaptation', 'quality_enhancement', 'universal_clarity'] as HeuristicType[],
    variables: [
      { name: 'complex_concept', type: 'text' as const, required: true, description: 'The complex idea or concept to explain' },
      { name: 'audience_level', type: 'select' as const, options: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'beginner', required: true, description: 'Target audience knowledge level' },
      { name: 'familiar_domain', type: 'text' as const, default: 'cooking', required: true, description: 'Familiar domain for analogies (e.g., cooking, sports, nature)' }
    ],
    created_at: '2024-06-08T12:30:00Z',
    updated_at: '2024-06-08T12:30:00Z',
    version: 1,
    usage_count: 0,
    category: 'learning_research' as PromptCategory
  }
];
