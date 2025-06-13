
import { CoPilotMessage } from './types';
import { MessageGenerator } from './messageGenerator';

export class ConversationManager {
  private conversationHistory: CoPilotMessage[] = [];

  initialize(): void {
    this.conversationHistory = [MessageGenerator.createInitialMessage()];
  }

  addMessage(message: CoPilotMessage): void {
    this.conversationHistory.push(message);
  }

  clearHistory(): void {
    this.conversationHistory = [MessageGenerator.createInitialMessage()];
  }

  getHistory(): CoPilotMessage[] {
    return [...this.conversationHistory];
  }
}
