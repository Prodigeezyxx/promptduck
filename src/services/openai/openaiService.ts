
import OpenAI from 'openai';
import { GenerationRequest, GenerationResult } from '@/types';
import { OPENAI_CONFIG } from './config';
import { OpenAIErrorHandler } from './errorHandler';
import { OpenAIResponseParser } from './responseParser';
import { OpenAIPromptBuilder } from './promptBuilder';
import { OpenAIFallbackGenerator } from './fallbackGenerator';
import { OptimizedPromptBuilder } from '../optimized/promptBuilder';
import { OptimizedTextCleaner } from '../optimized/textCleaner';
import { defaultPromptImprover } from '../core/promptImprover';

export class OpenAIService {
  private openai: OpenAI | null = null;
  private isInitialized = false;
  private currentApiKey: string = '';

  initialize(apiKey: string): void {
    if (this.currentApiKey !== apiKey) {
      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });
      this.currentApiKey = apiKey;
    }
    this.isInitialized = true;
  }

  async generateChatResponse(prompt: string): Promise<string> {
    if (!this.isInitialized || !this.openai) {
      throw new Error('OpenAI service not initialized');
    }

    try {
      // Use optimized dynamic prompt
      const systemPrompt = OptimizedPromptBuilder.buildDynamicChatPrompt(prompt);
      
      const messages = [
        { role: 'system' as const, content: systemPrompt },
        { role: 'user' as const, content: prompt }
      ];
      
      const completion = await this.openai.chat.completions.create({
        model: OPENAI_CONFIG.models[0],
        messages: messages,
        max_tokens: 2048, // Increased from 800 to prevent truncation
        temperature: 0.9,
        top_p: 0.8,
        frequency_penalty: 0,
        presence_penalty: 0
      });

      const text = completion.choices[0]?.message?.content;

      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from OpenAI model');
      }

      return OptimizedTextCleaner.fastClean(text);
    } catch (error) {
      throw new Error(`OpenAI chat generation failed: ${error.message}`);
    }
  }

  async generatePrompt(request: GenerationRequest): Promise<GenerationResult> {
    if (!this.isInitialized || !this.openai) {
      throw new Error('OpenAI service not initialized');
    }

    const startTime = Date.now();

    try {
      if (!request.intent?.trim()) {
        throw new Error('Intent is required and cannot be empty');
      }

      // Fast path optimization
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

      const messages = OpenAIPromptBuilder.buildSystemPrompt(enhancedRequest);
      
      try {
        const fastestModel = OPENAI_CONFIG.models[0];
        
        const completion = await this.openai.chat.completions.create({
          model: fastestModel,
          messages: messages,
          max_tokens: 2048, // Increased for better responses
          temperature: 0.7, // Balanced for speed and quality
          top_p: 0.9,
          frequency_penalty: 0,
          presence_penalty: 0
        });

        const text = completion.choices[0]?.message?.content;

        if (!text || text.trim().length === 0) {
          throw new Error(`Empty response from model ${fastestModel}`);
        }

        const generationTime = Date.now() - startTime;
        const parsedResult = OpenAIResponseParser.parseResponse(text, enhancedRequest, generationTime);
        
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
      } catch (fastModelError) {
        // Single fallback instead of multiple retries
        const fallbackModel = OPENAI_CONFIG.models[1] || OPENAI_CONFIG.models[0];
        const completion = await this.openai.chat.completions.create({
          model: fallbackModel,
          messages: messages,
          max_tokens: 2048, // Consistent token limit
          temperature: 0.7,
          top_p: 0.9
        });

        const text = completion.choices[0]?.message?.content;
        if (!text || text.trim().length === 0) {
          throw new Error('All models failed');
        }

        const generationTime = Date.now() - startTime;
        return OpenAIResponseParser.parseResponse(text, enhancedRequest, generationTime);
      }

    } catch (error) {
      return OpenAIFallbackGenerator.generateFallbackPrompt(request);
    }
  }

  async testConnection(apiKey: string): Promise<boolean> {
    try {
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });
      
      const completion = await openai.chat.completions.create({
        model: OPENAI_CONFIG.models[0],
        messages: [{ role: 'user', content: 'Test connection. Respond with "OK".' }],
        max_tokens: 10
      });
      
      const text = completion.choices[0]?.message?.content;
      return text?.includes('OK') || false;
    } catch (error) {
      return false;
    }
  }
}
