
import { GenerationResult } from '@/types';
import { geminiService } from './geminiService';

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
  parent_id?: string;
}

export class PromptAnalysisService {
  async analyzePromptAndResponse(
    prompt: string, 
    response: string, 
    intent: string
  ): Promise<PromptAnalysis> {
    if (!geminiService) {
      throw new Error('Gemini service not initialized');
    }

    const analysisPrompt = `Analyze this prompt-response pair for quality and improvement opportunities:

ORIGINAL INTENT: ${intent}

PROMPT USED:
${prompt}

AI RESPONSE RECEIVED:
${response}

Analyze this interaction and provide improvement suggestions. Return ONLY valid JSON:
{
  "quality_score": 8,
  "strengths": ["clear instructions", "specific context"],
  "weaknesses": ["too verbose", "lacks constraints"],
  "improvement_suggestions": [
    "Add word count limit to control response length",
    "Include specific output format requirements",
    "Add examples for better clarity"
  ],
  "refined_prompt": "improved version of the original prompt",
  "analysis_reasoning": "Brief explanation of the analysis and suggested improvements"
}`;

    try {
      const result = await geminiService.generatePrompt({
        intent: analysisPrompt,
        heuristics: ['recursive_refinement', 'contradiction_stacking'],
        complexity: 'advanced'
      });

      return this.parseAnalysisResponse(result.optimized_prompt, prompt);
    } catch (error) {
      console.error('Analysis failed:', error);
      return this.generateFallbackAnalysis(prompt, response);
    }
  }

  private parseAnalysisResponse(text: string, originalPrompt: string): PromptAnalysis {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return this.generateFallbackAnalysis(originalPrompt, '');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        quality_score: parsed.quality_score || 7,
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Well-structured prompt'],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : ['Could be more specific'],
        improvement_suggestions: Array.isArray(parsed.improvement_suggestions) 
          ? parsed.improvement_suggestions 
          : ['Add more specific constraints', 'Include examples', 'Specify output format'],
        refined_prompt: parsed.refined_prompt || originalPrompt,
        analysis_reasoning: parsed.analysis_reasoning || 'Analysis completed successfully'
      };
    } catch (error) {
      console.error('Failed to parse analysis:', error);
      return this.generateFallbackAnalysis(originalPrompt, '');
    }
  }

  private generateFallbackAnalysis(prompt: string, response: string): PromptAnalysis {
    return {
      quality_score: 6,
      strengths: ['Contains clear intent'],
      weaknesses: ['Could be more specific', 'Lacks constraints'],
      improvement_suggestions: [
        'Add specific output format requirements',
        'Include word count or length constraints',
        'Add examples to clarify expectations',
        'Specify tone and style preferences'
      ],
      refined_prompt: prompt,
      analysis_reasoning: 'Basic analysis completed - consider adding more specific requirements to improve results'
    };
  }

  generateIterationId(): string {
    return `iter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  createIteration(
    prompt: string, 
    response: string, 
    analysis: PromptAnalysis, 
    parentId?: string
  ): PromptIteration {
    return {
      id: this.generateIterationId(),
      prompt,
      response,
      analysis,
      timestamp: new Date().toISOString(),
      parent_id: parentId
    };
  }
}

export const promptAnalysisService = new PromptAnalysisService();
