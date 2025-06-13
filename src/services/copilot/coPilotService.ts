
import { promptAnalysisService, PromptAnalysis } from '../promptAnalysisService';
import { CoPilotMessage } from './types';
import { MessageGenerator } from './messageGenerator';
import { PromptProcessor } from './promptProcessor';
import { PromptTester } from './promptTester';
import { IterationManager } from './iterationManager';
import { ConversationManager } from './conversationManager';

export class CoPilotService {
  private conversationManager = new ConversationManager();
  private promptProcessor = new PromptProcessor();
  private iterationManager = new IterationManager();
  private promptTester = new PromptTester(
    this.promptProcessor,
    (prompt, response, analysis) => this.iterationManager.addIteration(prompt, response, analysis)
  );

  initialize(): void {
    this.conversationManager.initialize();
  }

  addMessage(message: CoPilotMessage): void {
    this.conversationManager.addMessage(message);
  }

  clearHistory(): void {
    this.conversationManager.clearHistory();
    this.promptProcessor.setCurrentPrompt('');
    this.promptProcessor.setCurrentIntent('');
    this.iterationManager.clearIterations();
  }

  getHistory(): CoPilotMessage[] {
    return this.conversationManager.getHistory();
  }

  async analyzeCurrentPrompt(prompt: string, response: string): Promise<PromptAnalysis> {
    console.log('Analyzing prompt and response...');
    return await promptAnalysisService.analyzePromptAndResponse(
      prompt,
      response,
      this.promptProcessor.getCurrentIntent()
    );
  }

  getIterations() {
    return this.iterationManager.getIterations();
  }

  async processUserMessage(message: string): Promise<CoPilotMessage> {
    this.conversationManager.addMessage(MessageGenerator.createUserMessage(message));

    if (message.toLowerCase().startsWith('test prompt:')) {
      const promptText = message.substring(12).trim();
      return this.promptTester.handlePromptTesting(promptText);
    } else if (message.toLowerCase().startsWith('question:')) {
      const question = message.substring(8).trim();
      return this.promptProcessor.processQuestion(question);
    } else if (message.toLowerCase().startsWith('refine:')) {
      const refinement = message.substring(7).trim();
      return this.promptProcessor.processRefinement(refinement);
    } else {
      return MessageGenerator.createAssistantMessage(
        "I'm here to help you test and refine prompts. Type 'test prompt: [your prompt]' to get started!"
      );
    }
  }

  async applyRefinementSuggestion(suggestion: string): Promise<CoPilotMessage> {
    return this.promptProcessor.applyRefinementSuggestion(suggestion);
  }
}

export const coPilotService = new CoPilotService();
