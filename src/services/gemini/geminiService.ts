
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { GenerationRequest, GenerationResult } from '@/types';
import { GEMINI_CONFIG } from './config';
import { GeminiErrorHandler } from './errorHandler';
import { GeminiResponseParser } from './responseParser';
import { GeminiPromptBuilder } from './promptBuilder';
import { GeminiFallbackGenerator } from './fallbackGenerator';

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;

  initialize(apiKey: string) {
    console.log('Initializing Gemini service...');
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use the latest Gemini 2.0 model
    this.model = this.genAI.getGenerativeModel({ model: GEMINI_CONFIG.models[0] });
    console.log('Gemini service initialized with model:', GEMINI_CONFIG.models[0]);
  }

  async generatePrompt(request: GenerationRequest): Promise<GenerationResult> {
    if (!this.genAI) {
      throw new Error('Gemini service not initialized');
    }

    console.log('Starting prompt generation with request:', request);
    const startTime = Date.now();

    const systemPrompt = GeminiPromptBuilder.buildSystemPrompt(request);
    console.log('Sending request to Gemini with prompt length:', systemPrompt.length);

    // Try each model with exponential backoff
    for (let modelIndex = 0; modelIndex < GEMINI_CONFIG.models.length; modelIndex++) {
      const modelName = GEMINI_CONFIG.models[modelIndex];
      console.log(`Attempting generation with model: ${modelName}`);
      
      try {
        const model = this.genAI.getGenerativeModel({ model: modelName });
        const result = await GeminiErrorHandler.retryWithBackoff(async () => {
          return await model.generateContent(systemPrompt);
        }, GEMINI_CONFIG.maxRetries);

        const response = await result.response;
        const text = response.text();

        console.log('Received response from Gemini, length:', text.length);
        console.log('Raw Gemini response:', text);

        const endTime = Date.now();
        return GeminiResponseParser.parseResponse(text, request, endTime - startTime);
      } catch (error) {
        console.error(`Model ${modelName} failed:`, error);
        
        // If this is a quota error and we have more models to try, continue
        if (GeminiErrorHandler.isQuotaError(error) && modelIndex < GEMINI_CONFIG.models.length - 1) {
          console.log(`Quota exceeded for ${modelName}, trying next model...`);
          continue;
        }
        
        // If this is the last model or a different error, handle accordingly
        if (modelIndex === GEMINI_CONFIG.models.length - 1) {
          console.log('All models failed, using fallback');
          return GeminiFallbackGenerator.generateFallbackPrompt(request);
        }
        
        // For non-quota errors, try next model
        continue;
      }
    }

    // This shouldn't be reached, but just in case
    return GeminiFallbackGenerator.generateFallbackPrompt(request);
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
