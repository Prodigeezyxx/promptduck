
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
  private cachedModel: any = null;
  private currentApiKey: string = '';

  initialize(apiKey: string): void {
    // Only reinitialize if API key changed
    if (this.currentApiKey !== apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.currentApiKey = apiKey;
      this.cachedModel = null; // Reset cached model
    }
    this.isInitialized = true;
  }

  private getOptimizedModel() {
    if (!this.cachedModel || !this.genAI) {
      const fastestModel = GEMINI_CONFIG.models[0]; // gemini-2.0-flash-exp
      this.cachedModel = this.genAI!.getGenerativeModel({ 
        model: fastestModel,
        generationConfig: {
          temperature: 0.9, // Higher for faster responses
          topP: 0.8,
          topK: 20,
          maxOutputTokens: 1024, // Reduced from 4096
        }
      });
    }
    return this.cachedModel;
  }

  /**
   * Optimized chat method for playground interactions - fast responses under 5s
   */
  async generateChatResponse(prompt: string): Promise<string> {
    if (!this.isInitialized || !this.genAI) {
      throw new Error('Gemini service not initialized');
    }

    try {
      const model = this.getOptimizedModel();
      
      // Send prompt directly without additional processing
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from model');
      }

      // Return raw response without heavy cleaning for speed
      return text.trim();
    } catch (error) {
      // Simplified error handling - fail fast
      throw new Error(`Chat generation failed: ${error.message}`);
    }
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

    const startTime = Date.now();

    try {
      // Validate the request
      if (!request.intent?.trim()) {
        throw new Error('Intent is required and cannot be empty');
      }

      // Use the new prompt improvement engine
      const improvement = await defaultPromptImprover.improvePrompt(request);

      // Use the enhanced prompt for generation
      const enhancedRequest = {
        ...request,
        intent: improvement.enhancedPrompt,
        heuristics: improvement.intentAnalysis.suggestedHeuristics,
        context: typeof request.context === 'string' ? request.context : undefined
      };

      const systemPrompt = GeminiPromptBuilder.buildSystemPrompt(enhancedRequest);
      
      // Optimized generation: try fastest model first, fallback if needed
      try {
        const fastestModel = GEMINI_CONFIG.models[0]; // gemini-2.0-flash-exp
        const model = this.genAI.getGenerativeModel({ 
          model: fastestModel,
          generationConfig: {
            temperature: 0.6, // Slightly higher for faster generation
          }
        });
        
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        if (!text || text.trim().length === 0) {
          throw new Error(`Empty response from model ${fastestModel}`);
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
        
        return parsedResult;
      } catch (fastModelError) {
        // Fallback to full retry logic with all models if fastest fails
        return await GeminiErrorHandler.retryWithBackoff(async () => {
          for (const modelName of GEMINI_CONFIG.models) {
            try {
              const model = this.genAI!.getGenerativeModel({ model: modelName });
              const result = await model.generateContent(systemPrompt);
              const response = await result.response;
              const text = response.text();

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
              
              return parsedResult;
            } catch (error) {
              if (modelName === GEMINI_CONFIG.models[GEMINI_CONFIG.models.length - 1]) {
                throw error;
              }
            }
          }
          throw new Error('All models failed');
        }, GEMINI_CONFIG.maxRetries);
      }

    } catch (error) {
      const generationTime = Date.now() - startTime;
      return GeminiFallbackGenerator.generateFallbackPrompt(request);
    }
  }

  async testConnection(apiKey: string): Promise<boolean> {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.models[0] });
      
      const result = await model.generateContent('Test connection. Respond with "OK".');
      const response = await result.response;
      const text = response.text();
      return text.includes('OK');
    } catch (error) {
      return false;
    }
  }
}
