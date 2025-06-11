
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GenerationRequest, GenerationResult } from '@/types';
import { GEMINI_CONFIG } from './config';
import { GeminiErrorHandler } from './errorHandler';
import { GeminiResponseParser } from './responseParser';
import { GeminiPromptBuilder } from './promptBuilder';
import { GeminiFallbackGenerator } from './fallbackGenerator';
import { defaultPromptImprover } from '../core/promptImprover';

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private isInitialized = false;

  initialize(apiKey: string): void {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.isInitialized = true;
    console.log('Gemini service initialized');
  }

  /**
   * Optimized chat method for playground interactions - provides direct conversational responses
   */
  async generateChatResponse(prompt: string): Promise<string> {
    if (!this.isInitialized || !this.genAI) {
      throw new Error('Gemini service not initialized');
    }

    console.log('Starting chat response generation for prompt:', prompt.slice(0, 100) + '...');

    return await GeminiErrorHandler.retryWithBackoff(async () => {
      for (const modelName of GEMINI_CONFIG.models) {
        try {
          console.log(`Attempting chat generation with model: ${modelName}`);
          const model = this.genAI!.getGenerativeModel({ 
            model: modelName,
            generationConfig: {
              temperature: 0.3,
              topP: 0.8,
              topK: 40,
              maxOutputTokens: 4096, // Increased from 2048 to prevent truncation
            }
          });
          
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();

          if (!text || text.trim().length === 0) {
            throw new Error(`Empty response from model ${modelName}`);
          }

          console.log(`Chat generation successful with model: ${modelName}`);
          return this.cleanResponseForChat(text);
        } catch (error) {
          console.warn(`Model ${modelName} failed for chat:`, error.message);
          if (modelName === GEMINI_CONFIG.models[GEMINI_CONFIG.models.length - 1]) {
            throw error;
          }
        }
      }
      throw new Error('All models failed for chat generation');
    }, GEMINI_CONFIG.maxRetries);
  }

  private cleanResponseForChat(text: string): string {
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

  async generatePrompt(request: GenerationRequest): Promise<GenerationResult> {
    if (!this.isInitialized || !this.genAI) {
      throw new Error('Gemini service not initialized');
    }

    console.log('Starting prompt generation with request:', JSON.stringify(request, null, 2));
    const startTime = Date.now();

    try {
      // Validate the request
      if (!request.intent?.trim()) {
        throw new Error('Intent is required and cannot be empty');
      }

      // Use the new prompt improvement engine
      const improvement = await defaultPromptImprover.improvePrompt(request);
      console.log('Prompt improvement analysis:', improvement);

      // Use the enhanced prompt for generation
      const enhancedRequest = {
        ...request,
        intent: improvement.enhancedPrompt,
        heuristics: improvement.intentAnalysis.suggestedHeuristics,
        context: typeof request.context === 'string' ? request.context : undefined // Ensure context is string or undefined
      };

      console.log('Enhanced request:', JSON.stringify(enhancedRequest, null, 2));

      const systemPrompt = GeminiPromptBuilder.buildSystemPrompt(enhancedRequest);
      console.log('System prompt length:', systemPrompt.length);
      console.log('System prompt preview:', systemPrompt.slice(0, 300) + '...');
      
      return await GeminiErrorHandler.retryWithBackoff(async () => {
        for (const modelName of GEMINI_CONFIG.models) {
          try {
            console.log(`Attempting generation with model: ${modelName}`);
            const model = this.genAI!.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(systemPrompt);
            const response = await result.response;
            const text = response.text();

            console.log(`Model ${modelName} response length:`, text.length);
            console.log(`Model ${modelName} response preview:`, text.slice(0, 500));

            if (!text || text.trim().length === 0) {
              throw new Error(`Empty response from model ${modelName}`);
            }

            const generationTime = Date.now() - startTime;
            const parsedResult = GeminiResponseParser.parseResponse(text, enhancedRequest, generationTime);
            
            // Add improvement metadata
            parsedResult.metadata = {
              ...parsedResult.metadata,
              improvement_confidence: improvement.confidenceScore,
              template_used: improvement.templateUsed,
              intent_detected: improvement.intentAnalysis.primaryIntent,
              heuristics_applied: improvement.heuristicsApplied
            };

            console.log('Generation successful with model:', modelName);
            console.log('Final result preview:', {
              title: parsedResult.preview_title,
              promptLength: parsedResult.optimized_prompt.length,
              tagsCount: parsedResult.tags.length,
              heuristicsCount: parsedResult.heuristics.length
            });
            
            return parsedResult;
          } catch (error) {
            console.warn(`Model ${modelName} failed:`, error.message);
            if (modelName === GEMINI_CONFIG.models[GEMINI_CONFIG.models.length - 1]) {
              throw error;
            }
          }
        }
        throw new Error('All models failed');
      }, GEMINI_CONFIG.maxRetries);

    } catch (error) {
      console.error('Gemini generation failed:', error.message);
      console.error('Error details:', error);
      const generationTime = Date.now() - startTime;
      console.log('Using fallback generator due to error');
      return GeminiFallbackGenerator.generateFallbackPrompt(request);
    }
  }

  async testConnection(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing API connection...');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.models[0] });
      
      const result = await model.generateContent('Test connection. Respond with "OK".');
      const response = await result.response;
      const text = response.text();
      console.log('API test response:', text);
      return text.includes('OK');
    } catch (error) {
      console.error('API key test failed:', error);
      return false;
    }
  }
}
