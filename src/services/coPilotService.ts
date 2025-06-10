import { geminiService } from './geminiService';
import { selectHeuristics } from '@/utils/heuristicSelector';
import { HeuristicType } from '@/types';
import { promptAnalysisService, PromptAnalysis, PromptIteration } from './promptAnalysisService';

export interface CoPilotMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export enum CoPilotPersona {
  DEFAULT = 'default',
  STRATEGIST = 'strategist',
  DREAMER = 'dreamer',
  BUILDER = 'builder',
  CONNECTOR = 'connector',
  CREATOR = 'creator'
}

export interface CoPilotSettings {
  persona: CoPilotPersona;
  tone: 'neutral' | 'friendly' | 'professional';
  style: 'concise' | 'detailed' | 'creative';
  complexity: 'simple' | 'intermediate' | 'advanced';
}

// Counter to ensure unique IDs even for rapid successive calls
let coPilotMessageCounter = 0;

export class CoPilotService {
  private conversationHistory: CoPilotMessage[] = [];
  private currentPrompt: string = '';
  private currentIntent: string = '';
  private iterations: PromptIteration[] = [];

  private generateId(): string {
    coPilotMessageCounter += 1;
    return `copilot_${Date.now()}_${coPilotMessageCounter}_${Math.random().toString(36).substr(2, 9)}`;
  }

  initialize() {
    this.conversationHistory = [
      {
        id: this.generateId(),
        type: 'assistant',
        content: "Hey there! I'm your Prompt Co-Pilot. 👋 I can help you test, refine, and optimize your prompts. Just type 'test prompt: [your prompt]' to get started!",
        timestamp: new Date().toISOString()
      }
    ];
  }

  addMessage(message: CoPilotMessage) {
    this.conversationHistory.push(message);
  }

  clearHistory() {
    this.conversationHistory = [
      {
        id: this.generateId(),
        type: 'assistant',
        content: "Hey there! I'm your Prompt Co-Pilot. 👋 I can help you test, refine, and optimize your prompts. Just type 'test prompt: [your prompt]' to get started!",
        timestamp: new Date().toISOString()
      }
    ];
    this.currentPrompt = '';
    this.currentIntent = '';
    this.clearIterations();
  }

  getHistory(): CoPilotMessage[] {
    return [...this.conversationHistory];
  }

  async analyzeCurrentPrompt(prompt: string, response: string): Promise<PromptAnalysis> {
    console.log('Analyzing prompt and response...');
    return await promptAnalysisService.analyzePromptAndResponse(
      prompt, 
      response, 
      this.currentIntent
    );
  }

  addIteration(prompt: string, response: string, analysis: PromptAnalysis): PromptIteration {
    const parentId = this.iterations.length > 0 ? this.iterations[this.iterations.length - 1].id : undefined;
    const iteration = promptAnalysisService.createIteration(prompt, response, analysis, parentId);
    this.iterations.push(iteration);
    return iteration;
  }

  getIterations(): PromptIteration[] {
    return [...this.iterations];
  }

  clearIterations(): void {
    this.iterations = [];
  }

  async processUserMessage(message: string): Promise<CoPilotMessage> {
    this.addMessage({
      id: this.generateId(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });

    if (message.toLowerCase().startsWith('test prompt:')) {
      return this.handlePromptTesting(message);
    } else if (message.toLowerCase().startsWith('question:')) {
      return this.processQuestion(message);
    } else if (message.toLowerCase().startsWith('refine:')) {
      return this.processRefinement(message);
    } else {
      return {
        id: this.generateId(),
        type: 'assistant',
        content: "I'm here to help you test and refine prompts. Type 'test prompt: [your prompt]' to get started!",
        timestamp: new Date().toISOString()
      };
    }
  }

  private async processQuestion(message: string): Promise<CoPilotMessage> {
    const question = message.substring(8).trim();

    if (!this.currentPrompt) {
      return {
        id: this.generateId(),
        type: 'assistant',
        content: "Please test a prompt first before asking questions about it.",
        timestamp: new Date().toISOString()
      };
    }

    const prompt = `You are an expert prompt engineer. Answer this question about the following prompt:

Prompt: ${this.currentPrompt}
Question: ${question}

Provide a concise and helpful answer.`;

    try {
      const selectedHeuristics = selectHeuristics(prompt, question);
      const result = await geminiService.generatePrompt({
        intent: prompt,
        heuristics: selectedHeuristics,
        complexity: 'intermediate'
      });

      return {
        id: this.generateId(),
        type: 'assistant',
        content: result.optimized_prompt,
        metadata: {
          prompt_used: this.currentPrompt,
          heuristics: selectedHeuristics,
          question_asked: question
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to answer question:', error);
      return {
        id: this.generateId(),
        type: 'assistant',
        content: "I encountered an issue answering your question. Please try again.",
        timestamp: new Date().toISOString()
      };
    }
  }

  private async processRefinement(message: string): Promise<CoPilotMessage> {
    const refinement = message.substring(7).trim();

    if (!this.currentPrompt) {
      return {
        id: this.generateId(),
        type: 'assistant',
        content: "Please test a prompt first before requesting refinements.",
        timestamp: new Date().toISOString()
      };
    }

    const prompt = `You are an expert prompt engineer. Refine this prompt based on the following instructions:

Original Prompt: ${this.currentPrompt}
Refinement Instructions: ${refinement}

Provide an improved version of the prompt.`;

    try {
      const selectedHeuristics = selectHeuristics(prompt, refinement);
      const result = await geminiService.generatePrompt({
        intent: prompt,
        heuristics: selectedHeuristics,
        complexity: 'advanced'
      });

      this.currentPrompt = result.optimized_prompt;

      return {
        id: this.generateId(),
        type: 'assistant',
        content: `I've refined the prompt based on your instructions:\n\n${result.optimized_prompt}`,
        metadata: {
          prompt_used: result.optimized_prompt,
          heuristics: selectedHeuristics,
          refinement_instructions: refinement
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to refine prompt:', error);
      return {
        id: this.generateId(),
        type: 'assistant',
        content: "I encountered an issue refining the prompt. Please try again.",
        timestamp: new Date().toISOString()
      };
    }
  }

  private async handlePromptTesting(message: string): Promise<CoPilotMessage> {
    const promptText = message.substring(12).trim();
    this.currentIntent = promptText;
    this.currentPrompt = promptText;

    if (!promptText) {
      return {
        id: this.generateId(),
        type: 'assistant',
        content: "Please provide a prompt to test. Example: 'test prompt: write a poem about a duck'",
        timestamp: new Date().toISOString()
      };
    }

    try {
      const selectedHeuristics = selectHeuristics(promptText, '');
      const result = await geminiService.generatePrompt({
        intent: promptText,
        heuristics: selectedHeuristics,
        complexity: 'intermediate'
      });

      // After getting the response, analyze it
      console.log('Analyzing prompt performance...');
      const analysis = await this.analyzeCurrentPrompt(this.currentPrompt, result.optimized_prompt);
      
      // Add this iteration to history
      this.addIteration(this.currentPrompt, result.optimized_prompt, analysis);

      return {
        id: this.generateId(),
        type: 'assistant',
        content: result.optimized_prompt,
        metadata: {
          prompt_used: this.currentPrompt,
          heuristics: selectedHeuristics,
          analysis: analysis,
          iteration_count: this.iterations.length
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to generate prompt:', error);
      return {
        id: this.generateId(),
        type: 'assistant',
        content: "I encountered an issue generating a response. Please try again.",
        timestamp: new Date().toISOString()
      };
    }
  }

  async applyRefinementSuggestion(suggestion: string): Promise<CoPilotMessage> {
    const refinementPrompt = `Based on this suggestion: "${suggestion}", please refine the current prompt:

Current prompt: ${this.currentPrompt}
Current intent: ${this.currentIntent}

Apply the suggestion and return an improved version of the prompt.`;

    try {
      const selectedHeuristics = selectHeuristics(refinementPrompt, this.currentPrompt);
      const result = await geminiService.generatePrompt({
        intent: refinementPrompt,
        heuristics: selectedHeuristics,
        complexity: 'intermediate'
      });

      // Update current prompt with refined version
      this.currentPrompt = result.optimized_prompt;

      return {
        id: this.generateId(),
        type: 'assistant',
        content: `I've applied the suggestion and refined your prompt:\n\n${result.optimized_prompt}`,
        metadata: {
          prompt_used: result.optimized_prompt,
          heuristics: selectedHeuristics,
          suggestion_applied: suggestion
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to apply refinement suggestion:', error);
      return {
        id: this.generateId(),
        type: 'assistant',
        content: 'I encountered an issue applying that suggestion. Could you try a different approach or be more specific about what you\'d like to improve?',
        timestamp: new Date().toISOString()
      };
    }
  }
}

export const coPilotService = new CoPilotService();
