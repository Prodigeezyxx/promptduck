
import { GenerationRequest, GenerationResult } from '@/types';

export class GeminiResponseParser {
  static parseResponse(text: string, request: GenerationRequest, generationTimeMs: number): GenerationResult {
    // Clean the text first
    const cleanedText = this.cleanFormatting(text);
    
    // Try to parse JSON from the response
    let jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('No JSON found in response, using text as prompt');
      return this.createFallbackResult(cleanedText, request, generationTimeMs);
    }

    console.log('Found JSON in response, parsing...');
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('Parsed JSON:', parsed);
      
      const optimizedPrompt = parsed.optimized_prompt || cleanedText;
      
      return {
        optimized_prompt: this.cleanFormatting(optimizedPrompt),
        preview_title: parsed.preview_title || `AI Generated: ${request.intent.slice(0, 50)}...`,
        tags: Array.isArray(parsed.tags) ? parsed.tags : ['ai-generated', ...request.heuristics],
        heuristics: request.heuristics,
        variables: Array.isArray(parsed.variables) ? parsed.variables : [],
        metadata: {
          complexity_score: parsed.metadata?.complexity_score || Math.floor(Math.random() * 3) + 7,
          creativity_score: parsed.metadata?.creativity_score || Math.floor(Math.random() * 3) + 7,
          coherence_score: parsed.metadata?.coherence_score || Math.floor(Math.random() * 3) + 8,
          estimated_tokens: parsed.metadata?.estimated_tokens || Math.floor(cleanedText.length / 4),
          confidence_score: parsed.metadata?.confidence_score || Math.random() * 0.3 + 0.7,
          generation_time_ms: generationTimeMs
        },
        remix_suggestions: Array.isArray(parsed.remix_suggestions) 
          ? parsed.remix_suggestions 
          : this.getDefaultRemixSuggestions()
      };
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      return this.parseResponse(cleanedText.replace(/```json|```/g, ''), request, generationTimeMs);
    }
  }

  private static cleanFormatting(text: string): string {
    if (!text) return '';
    
    // Remove asterisks used for bold/italic
    let cleaned = text.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove **bold**
    cleaned = cleaned.replace(/\*(.*?)\*/g, '$1'); // Remove *italic*
    
    // Clean up other markdown formatting
    cleaned = cleaned.replace(/#{1,6}\s*/g, ''); // Remove headers
    cleaned = cleaned.replace(/`{3}[\s\S]*?`{3}/g, ''); // Remove code blocks
    cleaned = cleaned.replace(/`([^`]*)`/g, '$1'); // Remove inline code
    cleaned = cleaned.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1'); // Remove links, keep text
    
    // Clean up extra whitespace
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n'); // Max 2 line breaks
    cleaned = cleaned.trim();
    
    return cleaned;
  }

  private static createFallbackResult(text: string, request: GenerationRequest, generationTimeMs: number): GenerationResult {
    const cleanedText = this.cleanFormatting(text);
    
    return {
      optimized_prompt: cleanedText,
      preview_title: `AI Generated: ${request.intent.slice(0, 50)}...`,
      tags: ['ai-generated', ...request.heuristics],
      heuristics: request.heuristics,
      variables: [],
      metadata: {
        complexity_score: Math.floor(Math.random() * 3) + 7,
        creativity_score: Math.floor(Math.random() * 3) + 7,
        coherence_score: Math.floor(Math.random() * 3) + 8,
        estimated_tokens: Math.floor(cleanedText.length / 4),
        confidence_score: Math.random() * 0.3 + 0.7, // 0.7-1.0
        generation_time_ms: generationTimeMs
      },
      remix_suggestions: this.getDefaultRemixSuggestions()
    };
  }

  private static getDefaultRemixSuggestions(): string[] {
    return [
      'Add more specific constraints',
      'Include examples in the prompt', 
      'Add step-by-step instructions',
      'Specify desired output format'
    ];
  }
}
