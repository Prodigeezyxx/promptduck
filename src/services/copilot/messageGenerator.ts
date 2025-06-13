
import { CoPilotMessage } from './types';

// Counter to ensure unique IDs even for rapid successive calls
let coPilotMessageCounter = 0;

export class MessageGenerator {
  static generateId(): string {
    coPilotMessageCounter += 1;
    return `copilot_${Date.now()}_${coPilotMessageCounter}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static createInitialMessage(): CoPilotMessage {
    return {
      id: this.generateId(),
      type: 'assistant',
      content: "Hey there! I'm your Prompt Co-Pilot. 👋 I can help you test, refine, and optimize your prompts. Just type 'test prompt: [your prompt]' to get started!",
      timestamp: new Date().toISOString()
    };
  }

  static createUserMessage(content: string): CoPilotMessage {
    return {
      id: this.generateId(),
      type: 'user',
      content,
      timestamp: new Date().toISOString()
    };
  }

  static createAssistantMessage(content: string, metadata?: Record<string, any>): CoPilotMessage {
    return {
      id: this.generateId(),
      type: 'assistant',
      content,
      timestamp: new Date().toISOString(),
      metadata
    };
  }

  static createErrorMessage(error: string): CoPilotMessage {
    return {
      id: this.generateId(),
      type: 'assistant',
      content: `I encountered an issue: ${error}. Please try again.`,
      timestamp: new Date().toISOString()
    };
  }
}
