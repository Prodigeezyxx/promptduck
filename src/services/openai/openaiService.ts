
import { GenerationRequest, GenerationResult } from '@/types';
import { OPENAI_CONFIG } from './config';
import { OpenAIResponseParser } from './responseParser';
import { OpenAIFallbackGenerator } from './fallbackGenerator';
import { OptimizedTextCleaner } from '../optimized/textCleaner';
import { supabase } from '@/integrations/supabase/client';

export class OpenAIService {
  private isInitialized = false;

  initialize(): void {
    this.isInitialized = true;
  }

  async generateChatResponse(prompt: string): Promise<string> {
    if (!this.isInitialized) {
      this.initialize();
    }

    try {
      const { data, error } = await supabase.functions.invoke('chat-response', {
        body: { prompt: prompt.trim() }
      });

      if (error) {
        throw new Error(`Chat response failed: ${error.message}`);
      }

      if (!data?.response) {
        throw new Error('Empty response from chat service');
      }

      return OptimizedTextCleaner.fastClean(data.response);
    } catch (error) {
      throw new Error(`Chat generation failed: ${error.message}`);
    }
  }

  async generatePrompt(request: GenerationRequest): Promise<GenerationResult> {
    if (!this.isInitialized) {
      this.initialize();
    }

    const startTime = Date.now();

    try {
      if (!request.intent?.trim()) {
        throw new Error('Intent is required and cannot be empty');
      }

      // Send mode parameter to edge function
      const { data, error } = await supabase.functions.invoke('generate-prompt', {
        body: {
          intent: request.intent,
          context: request.context,
          heuristics: request.heuristics,
          complexity: request.complexity,
          mode: request.mode || 'general' // Include mode parameter
        }
      });

      if (error) {
        throw new Error(`Prompt generation failed: ${error.message}`);
      }

      if (!data) {
        throw new Error('Empty response from generation service');
      }

      const generationTime = Date.now() - startTime;
      
      // Convert the response to our expected format with minimal processing
      const result: GenerationResult = {
        result: data.optimized_prompt || data.result || '',
        optimized_prompt: data.optimized_prompt || '',
        preview_title: data.preview_title || `Generated: ${request.intent}`,
        tags: data.tags || ['generated'],
        heuristics: request.heuristics || [],
        variables: data.variables || [],
        metadata: {
          intent: request.intent,
          context: request.context,
          complexity: request.complexity,
          heuristics: request.heuristics,
          ...data.metadata,
          generation_time_ms: generationTime
        },
        remix_suggestions: data.remix_suggestions || []
      };
      
      return result;

    } catch (error) {
      console.error('Generation error:', error);
      return OpenAIFallbackGenerator.generateFallbackPrompt(request);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('chat-response', {
        body: { prompt: 'Test connection. Respond with "OK".' }
      });
      
      return !error && data?.response?.includes('OK');
    } catch (error) {
      return false;
    }
  }
}
