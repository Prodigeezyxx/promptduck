
import { openaiService } from './openaiService';
import { GenerationRequest } from '@/types';

export interface PromptAnalysis {
  quality_score: number;
  strengths: string[];
  weaknesses: string[];
  improvement_suggestions: string[];
  refined_prompt: string;
  analysis_reasoning: string;
}

export interface PromptIteration {
  id: string;
  prompt: string;
  response: string;
  analysis: PromptAnalysis;
  timestamp: string;
  parentId?: string;
}

class PromptAnalysisService {
  async analyzePromptAndResponse(prompt: string, response: string, intent: string = ''): Promise<PromptAnalysis> {
    const analysisPrompt = `You are an expert prompt analyst. Analyze the following prompt and its generated response, and provide feedback on its quality, strengths, and weaknesses. Also, provide concrete suggestions for improvement and a refined version of the prompt.

Prompt: ${prompt}

Generated Response: ${response}

Analysis should be thorough and constructive. Focus on specific areas such as clarity, relevance, coherence, and potential biases. Provide a quality score from 1 to 10.

${intent ? `The intent of the prompt is: ${intent}.` : 'The intent of the prompt is not specified.'}

OUTPUT FORMAT: Return ONLY valid JSON with no markdown formatting.

Required JSON structure:
{
  "quality_score": 7,
  "strengths": ["Clear instructions", "Well-structured"],
  "weaknesses": ["Lacks specific details", "Potential for bias"],
  "improvement_suggestions": ["Add more context", "Specify desired tone"],
  "refined_prompt": "Refined version of the prompt",
  "analysis_reasoning": "Detailed explanation of the analysis"
}
`;

    try {
      const result = await openaiService.generatePrompt({
        intent: analysisPrompt,
        complexity: 'advanced'
      } as GenerationRequest);
      return JSON.parse(result.optimized_prompt) as PromptAnalysis;
    } catch (error) {
      console.error('Failed to analyze prompt:', error);
      return {
        quality_score: 5,
        strengths: [],
        weaknesses: [],
        improvement_suggestions: [],
        refined_prompt: 'N/A',
        analysis_reasoning: 'Failed to generate analysis.'
      };
    }
  }

  createIteration(prompt: string, response: string, analysis: PromptAnalysis, parentId?: string): PromptIteration {
    return {
      id: `iteration_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      prompt: prompt,
      response: response,
      analysis: analysis,
      timestamp: new Date().toISOString(),
      parentId: parentId
    };
  }
}

export const promptAnalysisService = new PromptAnalysisService();
export { PromptAnalysisService };
