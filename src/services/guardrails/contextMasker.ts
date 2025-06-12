export interface MaskedContext {
  messages: Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    metadata?: {
      wasFiltered?: boolean;
      sensitivityLevel?: 'low' | 'medium' | 'high';
    };
  }>;
  sessionId: string;
  startTime: Date;
}

export class ContextMasker {
  private static readonly SENSITIVE_PATTERNS = [
    /system prompt/i,
    /internal logic/i,
    /model architecture/i,
    /training data/i,
    /api key/i,
    /configuration/i,
    /guardrail/i
  ];

  static maskSensitiveContent(content: string): string {
    let maskedContent = content;
    
    // Replace sensitive patterns with generic placeholders
    this.SENSITIVE_PATTERNS.forEach(pattern => {
      maskedContent = maskedContent.replace(pattern, '[REDACTED]');
    });

    // Remove potential code snippets that might reveal implementation
    maskedContent = maskedContent.replace(/```[\s\S]*?```/g, '[CODE_BLOCK_REDACTED]');
    
    // Remove URLs that might point to internal resources
    maskedContent = maskedContent.replace(/https?:\/\/[^\s]+/g, '[URL_REDACTED]');
    
    return maskedContent;
  }

  static shouldMaskMessage(content: string): boolean {
    return this.SENSITIVE_PATTERNS.some(pattern => pattern.test(content));
  }

  static createMaskedContext(messages: MaskedContext['messages']): MaskedContext {
    const maskedMessages = messages.map(message => {
      const shouldMask = this.shouldMaskMessage(message.content);
      
      return {
        ...message,
        content: shouldMask ? this.maskSensitiveContent(message.content) : message.content,
        metadata: {
          ...message.metadata,
          wasFiltered: shouldMask,
          sensitivityLevel: shouldMask ? this.assessSensitivityLevel(message.content) : 'low'
        }
      };
    });

    return {
      messages: maskedMessages,
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: new Date()
    };
  }

  private static assessSensitivityLevel(content: string): 'low' | 'medium' | 'high' {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('system') || lowerContent.includes('internal') || lowerContent.includes('api')) {
      return 'high';
    }
    
    if (lowerContent.includes('model') || lowerContent.includes('training') || lowerContent.includes('architecture')) {
      return 'medium';
    }
    
    return 'low';
  }

  static limitContextWindow(messages: MaskedContext['messages'], maxMessages: number = 10): MaskedContext['messages'] {
    // Keep only the most recent messages, prioritizing user messages
    const recentMessages = messages.slice(-maxMessages);
    
    // Ensure we don't leak too much context about system behavior
    return recentMessages.filter(message => {
      if (message.type === 'user') return true;
      if (message.metadata?.wasFiltered) return false;
      return true;
    });
  }
}
