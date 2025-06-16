
import { GenerationRequest, GenerationResult } from '@/types';
import { OPENAI_CONFIG } from './config';
import { OpenAIResponseParser } from './responseParser';
import { OpenAIPromptBuilder } from './promptBuilder';
import { OpenAIFallbackGenerator } from './fallbackGenerator';
import { OptimizedPromptBuilder } from '../optimized/promptBuilder';
import { OptimizedTextCleaner } from '../optimized/textCleaner';
import { defaultPromptImprover } from '../core/promptImprover';
import { supabase } from '@/integrations/supabase/client';

export class OpenAIService {
  private isInitialized = true; // Always initialized since we use Edge Functions

  initialize(): void {
    this.isInitialized = true;
  }

  async generateChatResponse(prompt: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('chat-completion', {
        body: { prompt }
      });

      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }

      if (!data?.content) {
        throw new Error('Empty response from chat completion');
      }

      return OptimizedTextCleaner.fastClean(data.content);
    } catch (error) {
      throw new Error(`Chat generation failed: ${error.message}`);
    }
  }

  async generatePrompt(request: GenerationRequest): Promise<GenerationResult> {
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
        const { data, error } = await supabase.functions.invoke('generate-prompt', {
          body: {
            messages,
            model: OPENAI_CONFIG.models[0],
            max_tokens: 2048,
            temperature: 0.7
          }
        });

        if (error) {
          throw new Error(`Edge function error: ${error.message}`);
        }

        const text = data.choices[0]?.message?.content;

        if (!text || text.trim().length === 0) {
          throw new Error('Empty response from prompt generation');
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
        // Single fallback with different model
        const { data, error } = await supabase.functions.invoke('generate-prompt', {
          body: {
            messages,
            model: OPENAI_CONFIG.models[1] || OPENAI_CONFIG.models[0],
            max_tokens: 2048,
            temperature: 0.7
          }
        });

        if (error) {
          throw new Error(`Fallback generation failed: ${error.message}`);
        }

        const text = data.choices[0]?.message?.content;
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

  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('chat-completion', {
        body: { prompt: 'Test connection. Respond with "OK".' }
      });

      if (error) return false;
      return data?.content?.includes('OK') || false;
    } catch (error) {
      return false;
    }
  }
}
