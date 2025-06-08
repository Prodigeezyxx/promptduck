
import { create } from 'zustand';
import { GenerationRequest, GenerationResult, PersonaType, HeuristicType } from '@/types';

interface GeneratorState {
  isGenerating: boolean;
  lastRequest: GenerationRequest | null;
  lastResult: GenerationResult | null;
  history: GenerationResult[];
  setGenerating: (generating: boolean) => void;
  setLastRequest: (request: GenerationRequest) => void;
  setLastResult: (result: GenerationResult) => void;
  addToHistory: (result: GenerationResult) => void;
  clearHistory: () => void;
}

export const useGeneratorStore = create<GeneratorState>((set, get) => ({
  isGenerating: false,
  lastRequest: null,
  lastResult: null,
  history: [],
  setGenerating: (generating) => set({ isGenerating: generating }),
  setLastRequest: (request) => set({ lastRequest: request }),
  setLastResult: (result) => {
    set({ lastResult: result });
    get().addToHistory(result);
  },
  addToHistory: (result) => {
    set(state => ({
      history: [result, ...state.history].slice(0, 50) // Keep last 50 generations
    }));
  },
  clearHistory: () => set({ history: [] })
}));
