
import { Prompt } from '@/types';

export const FEATURED_PROMPTS: Prompt[] = [
  {
    id: 'featured-content-strategist',
    title: 'Strategic Content Framework',
    description: 'Create content that drives engagement using proven storytelling frameworks',
    content: 'help me write something that gets people to buy my stuff',
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
    content: 'I want to make something cool that people would use but I dont know what',
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
    content: 'I want to get better at drawing but I am really bad and dont know where to start',
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
    content: 'everyone says you should work hard to be successful but what if thats wrong',
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
    content: 'how do I make people notice me online and want to work with me',
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
    content: 'I want to teach people something fun and make sure they actually learn it',
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
    content: 'I have this problem and I dont know how to solve it can you help me think about it differently',
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
    content: 'I need a way to come up with creative ideas but I want it to be organized not just random',
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
