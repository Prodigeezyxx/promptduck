// Enhanced mode configurations
export const MODES = {
  general: {
    id: 'general',
    name: 'General',
    systemPromptModifier: 'Generate versatile, well-structured prompts suitable for any AI platform.',
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
    targetPlatform: 'Any AI Platform'
  },
  lovable: {
    id: 'lovable',
    name: 'Lovable Transformer',
    systemPromptModifier: `You are the Lovable Prompt Transformer with advanced contextual intelligence.`,
    targetPlatform: 'Lovable.dev'
  }
};