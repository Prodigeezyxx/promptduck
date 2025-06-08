
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { GenerationRequest, GenerationResult, PersonaType, HeuristicType } from '@/types';
import { PROMPT_DUCK_SPECIFICATION, PERSONAS, HEURISTICS } from '@/constants';

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;

  initialize(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generatePrompt(request: GenerationRequest): Promise<GenerationResult> {
    if (!this.model) {
      throw new Error('Gemini service not initialized');
    }

    const persona = PERSONAS[request.persona];
    const heuristicsDesc = request.heuristics.map(h => HEURISTICS[h].description).join(', ');

    const systemPrompt = `${PROMPT_DUCK_SPECIFICATION}

CURRENT REQUEST:
Intent: ${request.intent}
Persona: ${persona.name} - ${persona.description}
Heuristics: ${heuristicsDesc}
Context: ${request.context || 'None provided'}
Style: ${request.style || 'balanced'}
Complexity: ${request.complexity || 'intermediate'}

Apply the ${persona.name} persona and use these heuristics: ${request.heuristics.join(', ')}.
Generate a prompt that embodies the persona's traits: ${persona.traits.join(', ')}.

Return ONLY a valid JSON object following the exact structure specified in the PromptDuck specification.`;

    try {
      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      // Try to parse JSON from the response
      let jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate and structure the response
      const generationResult: GenerationResult = {
        optimized_prompt: parsed.optimized_prompt || text,
        preview_title: parsed.preview_title || `${persona.name} Generated Prompt`,
        tags: Array.isArray(parsed.tags) ? parsed.tags : [request.persona, ...request.heuristics],
        persona: request.persona,
        heuristics: request.heuristics,
        variables: Array.isArray(parsed.variables) ? parsed.variables : [],
        metadata: {
          complexity_score: parsed.metadata?.complexity_score || Math.floor(Math.random() * 5) + 6,
          creativity_score: parsed.metadata?.creativity_score || Math.floor(Math.random() * 4) + 7,
          coherence_score: parsed.metadata?.coherence_score || Math.floor(Math.random() * 3) + 8,
          estimated_tokens: parsed.metadata?.estimated_tokens || Math.floor(text.length / 4)
        },
        remix_suggestions: Array.isArray(parsed.remix_suggestions) 
          ? parsed.remix_suggestions 
          : ['Contradict the main premise', 'Add temporal distortion', 'Switch to opposing persona', 'Merge with another chain']
      };

      return generationResult;
    } catch (error) {
      console.error('Gemini generation error:', error);
      
      // Fallback generation for demo purposes
      return this.generateFallbackPrompt(request);
    }
  }

  private generateFallbackPrompt(request: GenerationRequest): GenerationResult {
    const persona = PERSONAS[request.persona];
    
    return {
      optimized_prompt: `As a ${persona.name.toLowerCase()}, approach "${request.intent}" with ${persona.traits.slice(0, 2).join(' and ')} thinking. Consider multiple perspectives and create a comprehensive response that balances depth with clarity. Structure your approach around {key_focus} and ensure your output serves {target_outcome}.`,
      preview_title: `${persona.name}: ${request.intent}`,
      tags: [request.persona, 'generated', 'fallback'],
      persona: request.persona,
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
        'Switch to builder persona',
        'Merge with recursive refinement'
      ]
    };
  }

  async testConnection(apiKey: string): Promise<boolean> {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const result = await model.generateContent('Test connection. Respond with "OK".');
      const response = await result.response;
      return response.text().includes('OK');
    } catch (error) {
      console.error('API key test failed:', error);
      return false;
    }
  }
}

export const geminiService = new GeminiService();
