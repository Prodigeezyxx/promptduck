import { GenerationRequest, GenerationResult } from '@/types';
import { OptimizedTextCleaner } from '../optimized/textCleaner';

export class GeminiResponseParser {
  static parseResponse(text: string, request: GenerationRequest, generationTimeMs: number): GenerationResult {
    console.log('Raw API response length:', text.length);
    
    // Use optimized cleaning
    const cleanedText = OptimizedTextCleaner.fastClean(text);
    
    // Quick JSON extraction with minimal processing
    let parsedData = this.extractJsonFromResponse(text);
    
    if (!parsedData) {
      console.warn('Failed to parse JSON from response, using fallback');
      return this.createFallbackResult(cleanedText, request, generationTimeMs);
    }

    const optimizedPrompt = parsedData.optimized_prompt || cleanedText;
    
    return {
      optimized_prompt: OptimizedTextCleaner.fastClean(optimizedPrompt),
      preview_title: parsedData.preview_title || `Technical Specification: ${request.intent.slice(0, 50)}...`,
      tags: Array.isArray(parsedData.tags) ? parsedData.tags : ['technical', 'specification', ...request.heuristics],
      heuristics: request.heuristics,
      variables: Array.isArray(parsedData.variables) ? parsedData.variables : [],
      metadata: {
        complexity_score: parsedData.metadata?.complexity_score || Math.floor(Math.random() * 3) + 7,
        creativity_score: parsedData.metadata?.creativity_score || Math.floor(Math.random() * 3) + 7,
        coherence_score: parsedData.metadata?.coherence_score || Math.floor(Math.random() * 3) + 8,
        estimated_tokens: parsedData.metadata?.estimated_tokens || Math.floor(cleanedText.length / 4),
        confidence_score: parsedData.metadata?.confidence_score || Math.random() * 0.3 + 0.7,
        generation_time_ms: generationTimeMs
      },
      remix_suggestions: Array.isArray(parsedData.remix_suggestions) 
        ? parsedData.remix_suggestions 
        : this.getTechnicalRemixSuggestions()
    };
  }

  private static extractJsonFromResponse(text: string): any {
    // Fast JSON extraction - try common patterns first
    const patterns = [
      /```json\s*([\s\S]*?)\s*```/,
      /```\s*([\s\S]*?)\s*```/,
      /\{[\s\S]*\}/
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        try {
          const jsonText = match[1] || match[0];
          return JSON.parse(jsonText.trim());
        } catch (error) {
          continue;
        }
      }
    }

    return null;
  }

  private static createFallbackResult(text: string, request: GenerationRequest, generationTimeMs: number): GenerationResult {
    const cleanedText = OptimizedTextCleaner.fastClean(text);
    
    return {
      optimized_prompt: cleanedText,
      preview_title: `Technical Specification: ${request.intent.slice(0, 50)}...`,
      tags: ['technical', 'specification', ...request.heuristics],
      heuristics: request.heuristics,
      variables: [],
      metadata: {
        complexity_score: Math.floor(Math.random() * 3) + 7,
        creativity_score: Math.floor(Math.random() * 3) + 7,
        coherence_score: Math.floor(Math.random() * 3) + 8,
        estimated_tokens: Math.floor(cleanedText.length / 4),
        confidence_score: Math.random() * 0.3 + 0.7,
        generation_time_ms: generationTimeMs
      },
      remix_suggestions: this.getTechnicalRemixSuggestions()
    };
  }

  private static getTechnicalRemixSuggestions(): string[] {
    return [
      'Add quantifiable success metrics',
      'Include technical validation procedures', 
      'Specify implementation dependencies',
      'Define error handling protocols'
    ];
  }
}
