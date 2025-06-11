
import { PromptCategory } from '@/types';

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
