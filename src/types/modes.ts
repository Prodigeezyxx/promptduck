
export type ModeType = 'general' | 'builder' | 'cursor' | 'midjourney';

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
  isComingSoon?: boolean;
  disabled?: boolean;
}

export interface ModeConfiguration {
  general: Mode;
  builder: Mode;
  cursor: Mode;
  midjourney: Mode;
}
