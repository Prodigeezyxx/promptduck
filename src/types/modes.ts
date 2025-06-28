
export type ModeType = 'general' | 'lovable' | 'cursor' | 'midjourney';

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
  lovable: Mode;
  cursor: Mode;
  midjourney: Mode;
}
