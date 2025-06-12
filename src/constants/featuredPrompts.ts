
import { Prompt } from '@/types';

export const FEATURED_PROMPTS: Prompt[] = [
  {
    id: 'featured-content-strategist',
    title: 'Strategic Content Framework',
    description: 'Create content that drives engagement using proven storytelling frameworks',
    content: 'You are a content strategist who thinks like a psychologist and writes like a poet. Create a [CONTENT_TYPE] about [TOPIC] that uses the [FRAMEWORK] structure. Focus on emotional triggers that make readers feel [EMOTION] and include a clear call-to-action. Make it compelling enough that someone would save it and share it with their network.',
    category: 'content_creation',
    persona: 'strategist',
    heuristics: ['multi_role_collision', 'context_anchoring', 'format_optimization'],
    tags: ['content strategy', 'storytelling', 'engagement', 'frameworks'],
    difficulty: 'intermediate',
    estimatedTime: '15 minutes',
    variables: [
      { name: 'CONTENT_TYPE', type: 'text', required: true, description: 'Type of content to create (e.g., blog post, video, social media post)' },
      { name: 'TOPIC', type: 'text', required: true, description: 'Main subject or theme for the content' },
      { name: 'FRAMEWORK', type: 'text', required: true, description: 'Storytelling framework to apply (e.g., AIDA, Hero\'s Journey, Problem-Solution)' },
      { name: 'EMOTION', type: 'text', required: true, description: 'Target emotion to evoke in readers (e.g., inspiration, urgency, curiosity)' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1,
    usage_count: 0
  },
  {
    id: 'featured-product-dreamer',
    title: 'Future Product Visionary',
    description: 'Imagine breakthrough products by connecting unexpected dots',
    content: 'You are a product visionary who sees the invisible connections between seemingly unrelated trends. Imagine a product that combines [INDUSTRY_1] with [INDUSTRY_2] in a way that solves [PROBLEM]. Think like a time traveler from 2030 looking back. What would feel obvious then but seems impossible now? Describe this product using vivid metaphors and emotional stories.',
    category: 'product_thinking',
    persona: 'dreamer',
    heuristics: ['time_distortion', 'contradiction_stacking', 'contextual_adaptation'],
    tags: ['product vision', 'innovation', 'trends', 'future thinking'],
    difficulty: 'advanced',
    estimatedTime: '20 minutes',
    variables: [
      { name: 'INDUSTRY_1', type: 'text', required: true, description: 'First industry or sector to combine' },
      { name: 'INDUSTRY_2', type: 'text', required: true, description: 'Second industry or sector to combine' },
      { name: 'PROBLEM', type: 'text', required: true, description: 'Specific problem the combined product should solve' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1,
    usage_count: 0
  },
  {
    id: 'featured-learning-builder',
    title: 'Practical Learning System',
    description: 'Build actionable learning plans that stick',
    content: 'You are a learning architect who designs knowledge like building blocks. Create a 30-day learning system for [SKILL] that breaks down into daily 15-minute actions. Each day should build on the previous one. Include specific exercises, measurable milestones, and common pitfalls to avoid. Make it so practical that someone could start immediately.',
    category: 'learning_research',
    persona: 'builder',
    heuristics: ['recursive_refinement', 'format_optimization', 'quality_enhancement'],
    tags: ['learning systems', 'skill building', 'habits', 'practical'],
    difficulty: 'intermediate',
    estimatedTime: '25 minutes',
    variables: [
      { name: 'SKILL', type: 'text', required: true, description: 'The specific skill or competency to learn' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1,
    usage_count: 0
  },
  {
    id: 'featured-thought-connector',
    title: 'Contrarian Insight Generator',
    description: 'Challenge conventional wisdom with thoughtful contrarian takes',
    content: 'You are a thought leader who finds wisdom in paradoxes. Take the common belief that [COMMON_BELIEF] and craft a thoughtful contrarian perspective. Use the structure: "Everyone thinks X, but what if Y?" Support your argument with unexpected examples from [DOMAIN_1] and [DOMAIN_2]. Make it nuanced enough to spark debate, not just controversy.',
    category: 'thought_leadership',
    persona: 'connector',
    heuristics: ['contradiction_stacking', 'multi_role_collision', 'universal_clarity'],
    tags: ['contrarian thinking', 'thought leadership', 'perspectives', 'debate'],
    difficulty: 'advanced',
    estimatedTime: '30 minutes',
    variables: [
      { name: 'COMMON_BELIEF', type: 'text', required: true, description: 'Widely accepted belief or conventional wisdom to challenge' },
      { name: 'DOMAIN_1', type: 'text', required: true, description: 'First domain or field to draw examples from' },
      { name: 'DOMAIN_2', type: 'text', required: true, description: 'Second domain or field to draw examples from' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1,
    usage_count: 0
  },
  {
    id: 'featured-branding-creator',
    title: 'Personal Brand Architect',
    description: 'Craft authentic personal brands that magnetize opportunities',
    content: 'You are a personal brand alchemist who transforms authenticity into magnetic presence. Help me craft a personal brand for someone who is [PROFESSION] but wants to be known for [UNIQUE_ANGLE]. Create a brand narrative that weaves together their past experiences, current expertise, and future vision. Include specific language patterns, content themes, and positioning statements that feel authentic yet distinctive.',
    category: 'personal_branding',
    persona: 'creator',
    heuristics: ['context_anchoring', 'self_repairing', 'contextual_adaptation'],
    tags: ['personal branding', 'positioning', 'authenticity', 'narrative'],
    difficulty: 'intermediate',
    estimatedTime: '20 minutes',
    variables: [
      { name: 'PROFESSION', type: 'text', required: true, description: 'Current profession or role' },
      { name: 'UNIQUE_ANGLE', type: 'text', required: true, description: 'Unique positioning or specialty they want to be known for' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1,
    usage_count: 0
  },
  {
    id: 'featured-workshop-strategist',
    title: 'Interactive Workshop Designer',
    description: 'Design workshops that create lasting transformation',
    content: 'You are a workshop architect who designs transformative learning experiences. Create a 3-hour workshop on [TOPIC] for [AUDIENCE]. Structure it with: Opening hook (10 min), Core learning modules with interactive exercises (2.5 hours), Integration & action planning (20 min). Include specific activities, timing, materials needed, and expected outcomes. Make it so engaging that participants lose track of time.',
    category: 'course_workshop',
    persona: 'strategist',
    heuristics: ['format_optimization', 'recursive_refinement', 'quality_enhancement'],
    tags: ['workshop design', 'learning experience', 'facilitation', 'transformation'],
    difficulty: 'advanced',
    estimatedTime: '35 minutes',
    variables: [
      { name: 'TOPIC', type: 'text', required: true, description: 'Workshop topic or theme' },
      { name: 'AUDIENCE', type: 'text', required: true, description: 'Target audience and their characteristics' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1,
    usage_count: 0
  },
  {
    id: 'featured-versatile-dreamer',
    title: 'Multi-Perspective Problem Solver',
    description: 'Approach any challenge from multiple expert angles',
    content: 'You are a shape-shifting consultant who embodies different expert perspectives. Approach [CHALLENGE] from three distinct viewpoints: 1) A [EXPERT_TYPE_1] who focuses on [ASPECT_1], 2) A [EXPERT_TYPE_2] who prioritizes [ASPECT_2], 3) A [EXPERT_TYPE_3] who considers [ASPECT_3]. For each perspective, provide specific insights, recommended actions, and potential blind spots. Then synthesize all three into a unified approach.',
    category: 'general',
    persona: 'dreamer',
    heuristics: ['multi_role_collision', 'contextual_adaptation', 'universal_clarity'],
    tags: ['multi-perspective', 'problem solving', 'synthesis', 'expertise'],
    difficulty: 'advanced',
    estimatedTime: '25 minutes',
    variables: [
      { name: 'CHALLENGE', type: 'text', required: true, description: 'The challenge or problem to analyze' },
      { name: 'EXPERT_TYPE_1', type: 'text', required: true, description: 'First type of expert perspective' },
      { name: 'ASPECT_1', type: 'text', required: true, description: 'What the first expert focuses on' },
      { name: 'EXPERT_TYPE_2', type: 'text', required: true, description: 'Second type of expert perspective' },
      { name: 'ASPECT_2', type: 'text', required: true, description: 'What the second expert prioritizes' },
      { name: 'EXPERT_TYPE_3', type: 'text', required: true, description: 'Third type of expert perspective' },
      { name: 'ASPECT_3', type: 'text', required: true, description: 'What the third expert considers' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1,
    usage_count: 0
  },
  {
    id: 'featured-creative-builder',
    title: 'Innovation Framework Generator',
    description: 'Create systematic approaches to creative breakthroughs',
    content: 'You are an innovation architect who builds creativity into systems. Design a reusable framework for [CREATIVE_GOAL] that combines structured thinking with creative chaos. Include: 1) Divergent phase (idea generation methods), 2) Convergent phase (evaluation criteria), 3) Implementation phase (action steps). Make it detailed enough to use repeatedly but flexible enough to adapt to different contexts.',
    category: 'general',
    persona: 'builder',
    heuristics: ['recursive_refinement', 'format_optimization', 'self_repairing'],
    tags: ['innovation', 'creativity', 'frameworks', 'systematic'],
    difficulty: 'intermediate',
    estimatedTime: '30 minutes',
    variables: [
      { name: 'CREATIVE_GOAL', type: 'text', required: true, description: 'The creative objective or outcome the framework should achieve' }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1,
    usage_count: 0
  }
];
