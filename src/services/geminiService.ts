
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { GenerationRequest, GenerationResult, HeuristicType } from '@/types';
import { PROMPT_DUCK_SPECIFICATION, HEURISTICS } from '@/constants';

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;

  initialize(apiKey: string) {
    console.log('Initializing Gemini service...');
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use the latest Gemini Pro model
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
    console.log('Gemini service initialized with model: gemini-1.5-pro-latest');
  }

  async generatePrompt(request: GenerationRequest): Promise<GenerationResult> {
    if (!this.model) {
      throw new Error('Gemini service not initialized');
    }

    console.log('Starting prompt generation with request:', request);

    const heuristicsDesc = request.heuristics.map(h => HEURISTICS[h].description).join(', ');

    const systemPrompt = `${PROMPT_DUCK_SPECIFICATION}

CURRENT REQUEST:
Intent: ${request.intent}
Heuristics: ${heuristicsDesc}
Context: ${request.context || 'None provided'}
Complexity: ${request.complexity || 'intermediate'}

Use these heuristics: ${request.heuristics.join(', ')}.
Generate a practical, effective prompt that applies these cognitive approaches.

Return ONLY a valid JSON object following the exact structure specified in the PromptDuck specification.`;

    console.log('Sending request to Gemini with prompt length:', systemPrompt.length);
    console.log('Full system prompt:', systemPrompt);

    try {
      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      console.log('Received response from Gemini, length:', text.length);
      console.log('Raw Gemini response:', text);

      // Try to parse JSON from the response
      let jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('No JSON found in response, using text as prompt');
        // If no JSON, treat the entire response as the optimized prompt
        const generationResult: GenerationResult = {
          optimized_prompt: text.trim(),
          preview_title: `AI Generated: ${request.intent.slice(0, 50)}...`,
          tags: ['ai-generated', ...request.heuristics],
          heuristics: request.heuristics,
          variables: [],
          metadata: {
            complexity_score: Math.floor(Math.random() * 3) + 7,
            creativity_score: Math.floor(Math.random() * 3) + 7,
            coherence_score: Math.floor(Math.random() * 3) + 8,
            estimated_tokens: Math.floor(text.length / 4)
          },
          remix_suggestions: [
            'Add more specific constraints',
            'Include examples in the prompt', 
            'Add step-by-step instructions',
            'Specify desired output format'
          ]
        };
        console.log('Generated result from text response:', generationResult);
        return generationResult;
      }

      console.log('Found JSON in response, parsing...');
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('Parsed JSON:', parsed);
      
      // Validate and structure the response
      const generationResult: GenerationResult = {
        optimized_prompt: parsed.optimized_prompt || text,
        preview_title: parsed.preview_title || `AI Generated: ${request.intent.slice(0, 50)}...`,
        tags: Array.isArray(parsed.tags) ? parsed.tags : ['ai-generated', ...request.heuristics],
        heuristics: request.heuristics,
        variables: Array.isArray(parsed.variables) ? parsed.variables : [],
        metadata: {
          complexity_score: parsed.metadata?.complexity_score || Math.floor(Math.random() * 3) + 7,
          creativity_score: parsed.metadata?.creativity_score || Math.floor(Math.random() * 3) + 7,
          coherence_score: parsed.metadata?.coherence_score || Math.floor(Math.random() * 3) + 8,
          estimated_tokens: parsed.metadata?.estimated_tokens || Math.floor(text.length / 4)
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

      console.log('Successfully generated result:', generationResult);
      return generationResult;
    } catch (error) {
      console.error('Gemini generation error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText
      });
      
      // Only use fallback if there's a real error, not quota issues
      throw error;
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
        estimated_tokens: 150
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
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
      
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
