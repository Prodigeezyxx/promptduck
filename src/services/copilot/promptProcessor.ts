
import { openaiService } from '../openaiService';
import { selectHeuristics } from '@/utils/heuristicSelector';
import { CoPilotMessage } from './types';
import { MessageGenerator } from './messageGenerator';

export class PromptProcessor {
  private currentPrompt: string = '';
  private currentIntent: string = '';

  getCurrentPrompt(): string {
    return this.currentPrompt;
  }

  getCurrentIntent(): string {
    return this.currentIntent;
  }

  setCurrentPrompt(prompt: string): void {
    this.currentPrompt = prompt;
  }

  setCurrentIntent(intent: string): void {
    this.currentIntent = intent;
  }

  async processQuestion(question: string): Promise<CoPilotMessage> {
    if (!this.currentPrompt) {
      return MessageGenerator.createAssistantMessage(
        "Please test a prompt first before asking questions about it."
      );
    }

    const prompt = `You are an expert prompt engineer. Answer this question about the following prompt:

Prompt: ${this.currentPrompt}
Question: ${question}

Provide a concise and helpful answer.`;

    try {
      const selectedHeuristics = selectHeuristics(prompt, question);
      const result = await openaiService.generatePrompt({
        intent: prompt,
        heuristics: selectedHeuristics,
        complexity: 'intermediate'
      });

      return MessageGenerator.createAssistantMessage(result.optimized_prompt, {
        prompt_used: this.currentPrompt,
        heuristics: selectedHeuristics,
        question_asked: question
      });
    } catch (error) {
      console.error('Failed to answer question:', error);
      return MessageGenerator.createErrorMessage('answering your question');
    }
  }

  async processRefinement(refinement: string): Promise<CoPilotMessage> {
    if (!this.currentPrompt) {
      return MessageGenerator.createAssistantMessage(
        "Please test a prompt first before requesting refinements."
      );
    }

    const prompt = `You are an expert prompt engineer. Refine this prompt based on the following instructions:

Original Prompt: ${this.currentPrompt}
Refinement Instructions: ${refinement}

Provide an improved version of the prompt.`;

    try {
      const selectedHeuristics = selectHeuristics(prompt, refinement);
      const result = await openaiService.generatePrompt({
        intent: prompt,
        heuristics: selectedHeuristics,
        complexity: 'advanced'
      });

      this.currentPrompt = result.optimized_prompt;

      return MessageGenerator.createAssistantMessage(
        `I've refined the prompt based on your instructions:\n\n${result.optimized_prompt}`,
        {
          prompt_used: result.optimized_prompt,
          heuristics: selectedHeuristics,
          refinement_instructions: refinement
        }
      );
    } catch (error) {
      console.error('Failed to refine prompt:', error);
      return MessageGenerator.createErrorMessage('refining the prompt');
    }
  }

  async applyRefinementSuggestion(suggestion: string): Promise<CoPilotMessage> {
    const refinementPrompt = `Based on this suggestion: "${suggestion}", please refine the current prompt:

Current prompt: ${this.currentPrompt}
Current intent: ${this.currentIntent}

Apply the suggestion and return an improved version of the prompt.`;

    try {
      const selectedHeuristics = selectHeuristics(refinementPrompt, this.currentPrompt);
      const result = await openaiService.generatePrompt({
        intent: refinementPrompt,
        heuristics: selectedHeuristics,
        complexity: 'intermediate'
      });

      this.currentPrompt = result.optimized_prompt;

      return MessageGenerator.createAssistantMessage(
        `I've applied the suggestion and refined your prompt:\n\n${result.optimized_prompt}`,
        {
          prompt_used: result.optimized_prompt,
          heuristics: selectedHeuristics,
          suggestion_applied: suggestion
        }
      );
    } catch (error) {
      console.error('Failed to apply refinement suggestion:', error);
      return MessageGenerator.createAssistantMessage(
        'I encountered an issue applying that suggestion. Could you try a different approach or be more specific about what you\'d like to improve?'
      );
    }
  }
}
