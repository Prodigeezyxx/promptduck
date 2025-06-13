
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
