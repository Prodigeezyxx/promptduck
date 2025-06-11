
import { PersonaType } from '@/types';

export const PERSONAS: Record<PersonaType, {
  name: string;
  description: string;
  icon: string;
  traits: string[];
  color: string;
}> = {
  strategist: {
    name: '🧠 The Strategist',
    description: 'Analytical, system-mapping, goal-oriented',
    icon: '🧠',
    traits: ['Analytical', 'Systematic', 'Goal-oriented', 'Data-driven'],
    color: 'blue'
  },
  dreamer: {
    name: '🦋 The Dreamer',
    description: 'Expansive, metaphor-rich, visual thinker',
    icon: '🦋',
    traits: ['Expansive', 'Metaphorical', 'Visual', 'Intuitive'],
    color: 'purple'
  },
  builder: {
    name: '🛠 The Builder',
    description: 'Execution-first, short, clear outputs',
    icon: '🛠',
    traits: ['Execution-focused', 'Practical', 'Clear', 'Efficient'],
    color: 'orange'
  },
  connector: {
    name: '🎭 The Connector',
    description: 'Social dynamics, emotional triggers',
    icon: '🎭',
    traits: ['Social', 'Empathetic', 'Persuasive', 'Collaborative'],
    color: 'green'
  },
  creator: {
    name: '🌀 The Creator',
    description: 'Nonlinear, playful, remix mind',
    icon: '🌀',
    traits: ['Creative', 'Nonlinear', 'Playful', 'Innovative'],
    color: 'pink'
  }
};
