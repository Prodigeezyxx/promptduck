
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ApiKey } from '@/types';

interface ApiKeyState {
  apiKey: ApiKey | null;
  setApiKey: (key: string) => void;
  updateStatus: (status: ApiKey['status']) => void;
  clearApiKey: () => void;
  isValidKey: () => boolean;
}

export const useApiKeyStore = create<ApiKeyState>()(
  persist(
    (set, get) => ({
      apiKey: null,
      setApiKey: (key: string) => {
        set({
          apiKey: {
            gemini: key,
            created_at: new Date().toISOString(),
            status: 'active'
          }
        });
      },
      updateStatus: (status) => {
        const currentKey = get().apiKey;
        if (currentKey) {
          set({
            apiKey: {
              ...currentKey,
              status,
              last_used: new Date().toISOString()
            }
          });
        }
      },
      clearApiKey: () => set({ apiKey: null }),
      isValidKey: () => {
        const key = get().apiKey;
        return key?.status === 'active' && key.gemini.length > 0;
      }
    }),
    {
      name: 'promptduck-api-key'
    }
  )
);
