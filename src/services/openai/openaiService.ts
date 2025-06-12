
import OpenAI from 'openai';
import { GenerationRequest, GenerationResult } from '@/types';
import { OPENAI_CONFIG } from './config';
import { OpenAIErrorHandler } from './errorHandler';
import { OpenAIResponseParser } from './responseParser';
import { OpenAIPromptBuilder } from './promptBuilder';
import { OpenAIFallbackGenerator } from './fallbackGenerator';
import { defaultPromptImprover } from '../core/promptImprover';

export class OpenAIService {
  private openai: OpenAI | null = null;
  private isInitialized = false;
  private currentApiKey: string = '';

  initialize(apiKey: string): void {
    // Only reinitialize if API key changed
    if (this.currentApiKey !== apiKey) {
      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });
      this.currentApiKey = apiKey;
    }
    this.isInitialized = true;
  }

  /**
   * Optimized chat method for playground interactions - direct response generation
   */
  async generateChatResponse(prompt: string): Promise<string> {
    if (!this.isInitialized || !this.openai) {
      throw new Error('OpenAI service not initialized');
    }

    try {
      const messages = OpenAIPromptBuilder.buildChatMessages(prompt);
      
      const completion = await this.openai.chat.completions.create({
        model: OPENAI_CONFIG.models[0], // Use fastest model
        messages: messages,
        max_tokens: OPENAI_CONFIG.maxTokens, // Increased to prevent truncation
        temperature: 0.9, // Higher for faster responses
        top_p: 0.8,
        frequency_penalty: 0,
        presence_penalty: 0
      });

      const text = completion.choices[0]?.message?.content;

      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from OpenAI model');
      }

      // Apply text cleaning while maintaining speed
      return this.cleanResponseForChat(text);
    } catch (error) {
      // Simplified error handling - fail fast
      throw new Error(`OpenAI chat generation failed: ${error.message}`);
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
    if (!this.isInitialized || !this.openai) {
      throw new Error('OpenAI service not initialized');
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

      const messages = OpenAIPromptBuilder.buildSystemPrompt(enhancedRequest);
      
      // Optimized generation: try fastest model first, fallback if needed
      try {
        const fastestModel = OPENAI_CONFIG.models[0]; // gpt-4o-2024-11-20
        
        const completion = await this.openai.chat.completions.create({
          model: fastestModel,
          messages: messages,
          max_tokens: OPENAI_CONFIG.maxTokens,
          temperature: 0.6, // Slightly higher for faster generation
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
        return await OpenAIErrorHandler.retryWithBackoff(async () => {
          for (const modelName of OPENAI_CONFIG.models) {
            try {
              const completion = await this.openai!.chat.completions.create({
                model: modelName,
                messages: messages,
                max_tokens: OPENAI_CONFIG.maxTokens,
                temperature: 0.6,
                top_p: 0.9,
                frequency_penalty: 0,
                presence_penalty: 0
              });

              const text = completion.choices[0]?.message?.content;

              if (!text || text.trim().length === 0) {
                throw new Error(`Empty response from model ${modelName}`);
              }

              const generationTime = Date.now() - startTime;
              const parsedResult = OpenAIResponseParser.parseResponse(text, enhancedRequest, generationTime);
              
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
              if (modelName === OPENAI_CONFIG.models[OPENAI_CONFIG.models.length - 1]) {
                throw error;
              }
            }
          }
          throw new Error('All OpenAI models failed');
        }, OPENAI_CONFIG.maxRetries);
      }

    } catch (error) {
      const generationTime = Date.now() - startTime;
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
