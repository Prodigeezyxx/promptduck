
export type ModeType = 'general' | 'lovable' | 'replit' | 'bolt';

export interface Mode {
  id: ModeType;
  name: string;
  description: string;
  icon: string;
  color: string;
  targetPlatform: string;
  heuristics: string[];
  contextInjection: string[];
  formatRules: string[];
  systemPromptModifier: string;
  examples: string[];
  benefits: string[];
}

export interface ModeConfiguration {
  [K in ModeType]: Mode;
}
