
import { GenerationRequest, GenerationResult } from '@/types';
import { OPENAI_CONFIG } from './config';

export class OpenAIFallbackGenerator {
  static generateFallbackPrompt(request: GenerationRequest): GenerationResult {
    console.log('Using fallback prompt generation for OpenAI');
    return {
      optimized_prompt: `Approach "${request.intent}" with structured thinking. Consider multiple perspectives and create a comprehensive response that balances depth with clarity. Structure your approach around {key_focus} and ensure your output serves {target_outcome}.`,
      preview_title: `Generated: ${request.intent}`,
      tags: ['fallback'],
      heuristics: request.heuristics,
      variables: [
        { name: 'key_focus', type: 'text', required: true, description: 'Primary focus area' },
        { name: 'target_outcome', type: 'text', required: true, description: 'Desired outcome' }
      ],
      metadata: {
        ...OPENAI_CONFIG.fallbackPrompt
      },
      remix_suggestions: [
        'Add contradiction stacking',
        'Apply time distortion lens',
        'Increase complexity level',
        'Merge with recursive refinement'
      ]
    };
  }
}
