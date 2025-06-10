
import { GenerationRequest, GenerationResult } from '@/types';
import { GEMINI_CONFIG } from './config';

export class GeminiFallbackGenerator {
  static generateFallbackPrompt(request: GenerationRequest): GenerationResult {
    console.log('Using fallback prompt generation');
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
        ...GEMINI_CONFIG.fallbackPrompt
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
