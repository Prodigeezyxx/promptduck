
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
  }

  async generatePrompt(request: GenerationRequest): Promise<GenerationResult> {
    if (!this.isInitialized || !this.genAI) {
      throw new Error('Gemini service not initialized');
    }

    const startTime = Date.now();

    try {
      // Use the new prompt improvement engine
      const improvement = await defaultPromptImprover.improvePrompt(request);
      console.log('Prompt improvement analysis:', improvement);

      // Use the enhanced prompt for generation
      const enhancedRequest = {
        ...request,
        intent: improvement.enhancedPrompt,
        heuristics: improvement.intentAnalysis.suggestedHeuristics
      };

      const systemPrompt = GeminiPromptBuilder.buildSystemPrompt(enhancedRequest);
      
      return await GeminiErrorHandler.retryWithBackoff(async () => {
        for (const modelName of GEMINI_CONFIG.models) {
          try {
            const model = this.genAI!.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(systemPrompt);
            const response = await result.response;
            const text = response.text();

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
            console.warn(`Model ${modelName} failed:`, error);
            if (modelName === GEMINI_CONFIG.models[GEMINI_CONFIG.models.length - 1]) {
              throw error;
            }
          }
        }
        throw new Error('All models failed');
      }, GEMINI_CONFIG.maxRetries);

    } catch (error) {
      console.error('Gemini generation failed:', error);
      const generationTime = Date.now() - startTime;
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
