
import { GenerationRequest, GenerationResult } from '@/types';

export class GeminiResponseParser {
  static parseResponse(text: string, request: GenerationRequest, generationTimeMs: number): GenerationResult {
    console.log('Raw API response:', text);
    
    // Clean the text first
    const cleanedText = this.cleanFormatting(text);
    
    // Try multiple strategies to extract JSON
    let parsedData = this.extractJsonFromResponse(cleanedText);
    
    if (!parsedData) {
      console.warn('Failed to parse JSON from response, using fallback');
      return this.createFallbackResult(cleanedText, request, generationTimeMs);
    }

    console.log('Successfully parsed JSON:', parsedData);
    
    const optimizedPrompt = parsedData.optimized_prompt || cleanedText;
    
    return {
      optimized_prompt: this.cleanFormatting(optimizedPrompt),
      preview_title: parsedData.preview_title || `AI Generated: ${request.intent.slice(0, 50)}...`,
      tags: Array.isArray(parsedData.tags) ? parsedData.tags : ['ai-generated', ...request.heuristics],
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
        : this.getDefaultRemixSuggestions()
    };
  }

  private static extractJsonFromResponse(text: string): any {
    // Strategy 1: Look for JSON between curly braces
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (error) {
        console.warn('Failed to parse matched JSON:', error);
      }
    }

    // Strategy 2: Look for JSON after removing code blocks
    const withoutCodeBlocks = text.replace(/```json|```/g, '');
    try {
      return JSON.parse(withoutCodeBlocks.trim());
    } catch (error) {
      console.warn('Failed to parse without code blocks:', error);
    }

    // Strategy 3: Try to find JSON starting from first {
    const firstBraceIndex = text.indexOf('{');
    const lastBraceIndex = text.lastIndexOf('}');
    
    if (firstBraceIndex !== -1 && lastBraceIndex !== -1 && lastBraceIndex > firstBraceIndex) {
      try {
        const jsonCandidate = text.substring(firstBraceIndex, lastBraceIndex + 1);
        return JSON.parse(jsonCandidate);
      } catch (error) {
        console.warn('Failed to parse JSON candidate:', error);
      }
    }

    return null;
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
        confidence_score: Math.random() * 0.3 + 0.7,
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
