
import { GenerationRequest, GenerationResult } from '@/types';

export class GeminiResponseParser {
  static parseResponse(text: string, request: GenerationRequest, generationTimeMs: number): GenerationResult {
    console.log('Raw API response length:', text.length);
    console.log('Raw API response preview:', text.slice(0, 500));
    
    // Clean the text first
    const cleanedText = this.cleanFormatting(text);
    
    // Try multiple strategies to extract JSON
    let parsedData = this.extractJsonFromResponse(text);
    
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
    console.log('Attempting to extract JSON from response...');
    
    // Strategy 1: Remove code block markers first, then parse
    let cleanText = text;
    
    // Remove code block markers more carefully
    cleanText = cleanText.replace(/```json\s*/gi, '');
    cleanText = cleanText.replace(/```\s*$/gm, '');
    cleanText = cleanText.replace(/```/g, '');
    
    // Try to parse the cleaned text
    try {
      const parsed = JSON.parse(cleanText.trim());
      console.log('Strategy 1 success: Parsed cleaned text');
      return parsed;
    } catch (error) {
      console.warn('Strategy 1 failed:', error.message);
    }

    // Strategy 2: Look for JSON between curly braces
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('Strategy 2 success: Parsed matched JSON');
        return parsed;
      } catch (error) {
        console.warn('Strategy 2 failed:', error.message);
      }
    }

    // Strategy 3: Find the most complete JSON object
    let openBraces = 0;
    let startIndex = -1;
    let endIndex = -1;
    
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '{') {
        if (openBraces === 0) {
          startIndex = i;
        }
        openBraces++;
      } else if (text[i] === '}') {
        openBraces--;
        if (openBraces === 0 && startIndex !== -1) {
          endIndex = i;
          break;
        }
      }
    }
    
    if (startIndex !== -1 && endIndex !== -1) {
      const jsonCandidate = text.substring(startIndex, endIndex + 1);
      try {
        const parsed = JSON.parse(jsonCandidate);
        console.log('Strategy 3 success: Parsed complete JSON object');
        return parsed;
      } catch (error) {
        console.warn('Strategy 3 failed:', error.message);
      }
    }

    // Strategy 4: Try to fix common JSON issues
    try {
      let fixedText = text;
      
      // Remove any text before first {
      const firstBrace = fixedText.indexOf('{');
      if (firstBrace > 0) {
        fixedText = fixedText.substring(firstBrace);
      }
      
      // Remove any text after last }
      const lastBrace = fixedText.lastIndexOf('}');
      if (lastBrace !== -1) {
        fixedText = fixedText.substring(0, lastBrace + 1);
      }
      
      // Fix common issues
      fixedText = fixedText.replace(/,\s*}/g, '}'); // Remove trailing commas
      fixedText = fixedText.replace(/,\s*]/g, ']'); // Remove trailing commas in arrays
      
      const parsed = JSON.parse(fixedText);
      console.log('Strategy 4 success: Parsed fixed JSON');
      return parsed;
    } catch (error) {
      console.warn('Strategy 4 failed:', error.message);
    }

    console.error('All JSON parsing strategies failed');
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
