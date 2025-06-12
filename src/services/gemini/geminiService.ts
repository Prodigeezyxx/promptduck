import { GoogleGenerativeAI } from '@google/generative-ai';
import { GenerationRequest, GenerationResult } from '@/types';
import { GEMINI_CONFIG } from './config';
import { GeminiErrorHandler } from './errorHandler';
import { GeminiResponseParser } from './responseParser';
import { GeminiFallbackGenerator } from './fallbackGenerator';
import { OptimizedPromptBuilder } from '../optimized/promptBuilder';
import { OptimizedTextCleaner } from '../optimized/textCleaner';
import { defaultPromptImprover } from '../core/promptImprover';

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private isInitialized = false;
  private cachedModel: any = null;
  private currentApiKey: string = '';

  initialize(apiKey: string): void {
    if (this.currentApiKey !== apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.currentApiKey = apiKey;
      this.cachedModel = null;
    }
    this.isInitialized = true;
  }

  private getOptimizedModel() {
    if (!this.cachedModel || !this.genAI) {
      const fastestModel = GEMINI_CONFIG.models[0];
      this.cachedModel = this.genAI!.getGenerativeModel({ 
        model: fastestModel,
        generationConfig: {
          temperature: 0.9,
          topP: 0.8,
          topK: 20,
          maxOutputTokens: 512, // Reduced for speed
        }
      });
    }
    return this.cachedModel;
  }

  async generateChatResponse(prompt: string): Promise<string> {
    if (!this.isInitialized || !this.genAI) {
      throw new Error('Gemini service not initialized');
    }

    try {
      const model = this.getOptimizedModel();
      
      // Use optimized dynamic prompt builder
      const systemPrompt = OptimizedPromptBuilder.buildDynamicChatPrompt(prompt);
      const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}`;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from model');
      }

      // Use fast cleaning
      return OptimizedTextCleaner.fastClean(text);
    } catch (error) {
      throw new Error(`Chat generation failed: ${error.message}`);
    }
  }

  async generatePrompt(request: GenerationRequest): Promise<GenerationResult> {
    if (!this.isInitialized || !this.genAI) {
      throw new Error('Gemini service not initialized');
    }

    const startTime = Date.now();

    try {
      if (!request.intent?.trim()) {
        throw new Error('Intent is required and cannot be empty');
      }

      // Fast path - skip heavy improvement for simple requests
      const isSimpleRequest = request.intent.length < 100 && (!request.heuristics || request.heuristics.length <= 2);
      
      let enhancedRequest = request;
      if (!isSimpleRequest) {
        const improvement = await defaultPromptImprover.improvePrompt(request);
        enhancedRequest = {
          ...request,
          intent: improvement.enhancedPrompt,
          heuristics: improvement.intentAnalysis.suggestedHeuristics,
          context: typeof request.context === 'string' ? request.context : undefined
        };
      }

      // Use optimized prompt builder
      const systemPrompt = OptimizedPromptBuilder.buildFastGenerationPrompt(
        enhancedRequest.intent, 
        enhancedRequest.heuristics
      );
      
      const fastestModel = GEMINI_CONFIG.models[0];
      const model = this.genAI.getGenerativeModel({ 
        model: fastestModel,
        generationConfig: {
          temperature: 0.7, // Balanced for speed and quality
          maxOutputTokens: 800, // Reduced for faster response
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
      
      // Add improvement metadata only if improvement was applied
      if (!isSimpleRequest) {
        const improvement = await defaultPromptImprover.improvePrompt(request);
        parsedResult.metadata = {
          ...parsedResult.metadata,
          improvement_confidence: improvement.confidenceScore,
          template_used: improvement.templateUsed,
          intent_detected: improvement.intentAnalysis.primaryIntent,
          heuristics_applied: improvement.heuristicsApplied
        };
      }
      
      return parsedResult;

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
