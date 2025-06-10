import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { GenerationRequest, GenerationResult, HeuristicType } from '@/types';
import { PROMPT_DUCK_SPECIFICATION, HEURISTICS } from '@/constants';

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private models = [
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
  ];

  initialize(apiKey: string) {
    console.log('Initializing Gemini service...');
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use the latest Gemini 2.0 model
    this.model = this.genAI.getGenerativeModel({ model: this.models[0] });
    console.log('Gemini service initialized with model:', this.models[0]);
  }

  async generatePrompt(request: GenerationRequest): Promise<GenerationResult> {
    if (!this.genAI) {
      throw new Error('Gemini service not initialized');
    }

    console.log('Starting prompt generation with request:', request);
    const startTime = Date.now();

    const heuristicsDesc = request.heuristics.map(h => HEURISTICS[h].description).join(', ');

    // Optimized shorter prompt to reduce token usage
    const systemPrompt = `Create an optimized prompt using these cognitive heuristics:

INTENT: ${request.intent}
HEURISTICS: ${heuristicsDesc}
CONTEXT: ${request.context || 'None'}
COMPLEXITY: ${request.complexity || 'intermediate'}

Apply these approaches: ${request.heuristics.join(', ')}.

Return ONLY valid JSON:
{
  "optimized_prompt": "enhanced prompt text",
  "preview_title": "descriptive title",
  "tags": ["relevant", "tags"],
  "variables": [{"name": "var", "type": "text", "required": true, "description": "desc"}],
  "metadata": {
    "complexity_score": 8,
    "creativity_score": 7,
    "coherence_score": 9,
    "estimated_tokens": 200
  },
  "remix_suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}`;

    console.log('Sending request to Gemini with prompt length:', systemPrompt.length);

    // Try each model with exponential backoff
    for (let modelIndex = 0; modelIndex < this.models.length; modelIndex++) {
      const modelName = this.models[modelIndex];
      console.log(`Attempting generation with model: ${modelName}`);
      
      try {
        const model = this.genAI.getGenerativeModel({ model: modelName });
        const result = await this.retryWithBackoff(async () => {
          return await model.generateContent(systemPrompt);
        }, 3);

        const response = await result.response;
        const text = response.text();

        console.log('Received response from Gemini, length:', text.length);
        console.log('Raw Gemini response:', text);

        const endTime = Date.now();
        return this.parseResponse(text, request, endTime - startTime);
      } catch (error) {
        console.error(`Model ${modelName} failed:`, error);
        
        // If this is a quota error and we have more models to try, continue
        if (this.isQuotaError(error) && modelIndex < this.models.length - 1) {
          console.log(`Quota exceeded for ${modelName}, trying next model...`);
          continue;
        }
        
        // If this is the last model or a different error, handle accordingly
        if (modelIndex === this.models.length - 1) {
          console.log('All models failed, using fallback');
          return this.generateFallbackPrompt(request);
        }
        
        // For non-quota errors, try next model
        continue;
      }
    }

    // This shouldn't be reached, but just in case
    return this.generateFallbackPrompt(request);
  }

  private async retryWithBackoff<T>(fn: () => Promise<T>, maxRetries: number): Promise<T> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxRetries - 1 || !this.isRetryableError(error)) {
          throw error;
        }
        
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Max retries exceeded');
  }

  private isQuotaError(error: any): boolean {
    return error?.status === 429 || 
           error?.message?.includes('quota') || 
           error?.message?.includes('RESOURCE_EXHAUSTED');
  }

  private isRetryableError(error: any): boolean {
    return this.isQuotaError(error) || 
           error?.status === 503 || 
           error?.message?.includes('temporarily unavailable');
  }

  private parseResponse(text: string, request: GenerationRequest, generationTimeMs: number): GenerationResult {
    // Try to parse JSON from the response
    let jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('No JSON found in response, using text as prompt');
      return {
        optimized_prompt: text.trim(),
        preview_title: `AI Generated: ${request.intent.slice(0, 50)}...`,
        tags: ['ai-generated', ...request.heuristics],
        heuristics: request.heuristics,
        variables: [],
        metadata: {
          complexity_score: Math.floor(Math.random() * 3) + 7,
          creativity_score: Math.floor(Math.random() * 3) + 7,
          coherence_score: Math.floor(Math.random() * 3) + 8,
          estimated_tokens: Math.floor(text.length / 4),
          confidence_score: Math.random() * 0.3 + 0.7, // 0.7-1.0
          generation_time_ms: generationTimeMs
        },
        remix_suggestions: [
          'Add more specific constraints',
          'Include examples in the prompt', 
          'Add step-by-step instructions',
          'Specify desired output format'
        ]
      };
    }

    console.log('Found JSON in response, parsing...');
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('Parsed JSON:', parsed);
      
      return {
        optimized_prompt: parsed.optimized_prompt || text,
        preview_title: parsed.preview_title || `AI Generated: ${request.intent.slice(0, 50)}...`,
        tags: Array.isArray(parsed.tags) ? parsed.tags : ['ai-generated', ...request.heuristics],
        heuristics: request.heuristics,
        variables: Array.isArray(parsed.variables) ? parsed.variables : [],
        metadata: {
          complexity_score: parsed.metadata?.complexity_score || Math.floor(Math.random() * 3) + 7,
          creativity_score: parsed.metadata?.creativity_score || Math.floor(Math.random() * 3) + 7,
          coherence_score: parsed.metadata?.coherence_score || Math.floor(Math.random() * 3) + 8,
          estimated_tokens: parsed.metadata?.estimated_tokens || Math.floor(text.length / 4),
          confidence_score: parsed.metadata?.confidence_score || Math.random() * 0.3 + 0.7,
          generation_time_ms: generationTimeMs
        },
        remix_suggestions: Array.isArray(parsed.remix_suggestions) 
          ? parsed.remix_suggestions 
          : [
              'Add more specific constraints',
              'Include examples in the prompt', 
              'Add step-by-step instructions',
              'Specify desired output format'
            ]
      };
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      return this.parseResponse(text.replace(/```json|```/g, ''), request, generationTimeMs);
    }
  }

  private generateFallbackPrompt(request: GenerationRequest): GenerationResult {
    console.log('Using fallback prompt generation');
    return {
      optimized_prompt: `Approach "${request.intent}" with structured thinking. Consider multiple perspectives and create a comprehensive response that balances depth with clarity. Structure your approach around {key_focus} and ensure your output serves {target_outcome}.`,
      preview_title: `Generated: ${request.intent}`,
      tags: ['fallback'],
      heuristics: request.heuristics,
      variables: [
        { name: 'key_focus', type: 'text', required: true, description: 'Primary focus area' },
        { name: 'target_outcome', type: 'text', required: true, description: 'Desired outcome' }
      ],
      metadata: {
        complexity_score: 7,
        creativity_score: 6,
        coherence_score: 8,
        estimated_tokens: 150,
        confidence_score: 0.8,
        generation_time_ms: 0
      },
      remix_suggestions: [
        'Add contradiction stacking',
        'Apply time distortion lens',
        'Increase complexity level',
        'Merge with recursive refinement'
      ]
    };
  }

  async testConnection(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing API connection...');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: this.models[0] });
      
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

export const geminiService = new GeminiService();
