
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Prompt, PromptCategory, PersonaType } from '@/types';

interface PromptState {
  prompts: Prompt[];
  currentPrompt: Prompt | null;
  featuredPromptStats: Record<string, { views: number; clicks: number }>;
  setCurrentPrompt: (prompt: Prompt | null) => void;
  setPrompts: (prompts: Prompt[]) => void;
  addPrompt: (prompt: Omit<Prompt, 'id' | 'created_at' | 'updated_at' | 'version' | 'usage_count'>) => void;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  duplicatePrompt: (id: string) => void;
  getPromptsByCategory: (category: PromptCategory) => Prompt[];
  getPromptsByPersona: (persona: PersonaType) => Prompt[];
  incrementUsage: (id: string) => void;
  searchPrompts: (query: string) => Prompt[];
  clearHistory: () => void;
  trackFeaturedPromptView: (id: string) => void;
  trackFeaturedPromptClick: (id: string) => void;
  getFeaturedPromptStats: (id: string) => { views: number; clicks: number };
}

export const usePromptStore = create<PromptState>()(
  persist(
    (set, get) => ({
      prompts: [],
      currentPrompt: null,
      featuredPromptStats: {},
      setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
      setPrompts: (prompts) => set({ prompts }),
      addPrompt: (promptData) => {
        const newPrompt: Prompt = {
          ...promptData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          version: 1,
          usage_count: 0
        };
        set(state => ({ prompts: [...state.prompts, newPrompt] }));
      },
      updatePrompt: (id, updates) => {
        set(state => ({
          prompts: state.prompts.map(prompt =>
            prompt.id === id
              ? { ...prompt, ...updates, updated_at: new Date().toISOString() }
              : prompt
          )
        }));
      },
      deletePrompt: (id) => {
        set(state => ({
          prompts: state.prompts.filter(prompt => prompt.id !== id),
          currentPrompt: state.currentPrompt?.id === id ? null : state.currentPrompt
        }));
      },
      duplicatePrompt: (id) => {
        const prompt = get().prompts.find(p => p.id === id);
        if (prompt) {
          const duplicate: Prompt = {
            ...prompt,
            id: crypto.randomUUID(),
            title: `${prompt.title} (Copy)`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            version: 1,
            usage_count: 0,
            parent_id: id
          };
          set(state => ({ prompts: [...state.prompts, duplicate] }));
        }
      },
      getPromptsByCategory: (category) => {
        return get().prompts.filter(prompt => prompt.category === category);
      },
      getPromptsByPersona: (persona) => {
        return get().prompts.filter(prompt => prompt.persona === persona);
      },
      incrementUsage: (id) => {
        set(state => ({
          prompts: state.prompts.map(prompt =>
            prompt.id === id
              ? { ...prompt, usage_count: prompt.usage_count + 1 }
              : prompt
          )
        }));
      },
      searchPrompts: (query) => {
        const prompts = get().prompts;
        const lowercaseQuery = query.toLowerCase();
        return prompts.filter(prompt =>
          prompt.title.toLowerCase().includes(lowercaseQuery) ||
          prompt.description?.toLowerCase().includes(lowercaseQuery) ||
          prompt.content.toLowerCase().includes(lowercaseQuery) ||
          prompt.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        );
      },
      clearHistory: () => {
        set({ prompts: [], currentPrompt: null });
      },
      trackFeaturedPromptView: (id) => {
        set(state => ({
          featuredPromptStats: {
            ...state.featuredPromptStats,
            [id]: {
              views: (state.featuredPromptStats[id]?.views || 0) + 1,
              clicks: state.featuredPromptStats[id]?.clicks || 0
            }
          }
        }));
      },
      trackFeaturedPromptClick: (id) => {
        set(state => ({
          featuredPromptStats: {
            ...state.featuredPromptStats,
            [id]: {
              views: state.featuredPromptStats[id]?.views || 0,
              clicks: (state.featuredPromptStats[id]?.clicks || 0) + 1
            }
          }
        }));
      },
      getFeaturedPromptStats: (id) => {
        const stats = get().featuredPromptStats[id];
        return stats || { views: 0, clicks: 0 };
      }
    }),
    {
      name: 'promptduck-prompts-v2'
    }
  )
);
