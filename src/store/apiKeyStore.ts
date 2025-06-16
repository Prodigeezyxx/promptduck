
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
      apiKey: {
        openai: 'server-managed',
        created_at: new Date().toISOString(),
        status: 'active'
      },
      setApiKey: (key: string) => {
        // API key is managed on server side
        set({
          apiKey: {
            openai: 'server-managed',
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
      clearApiKey: () => set({ 
        apiKey: {
          openai: 'server-managed',
          created_at: new Date().toISOString(),
          status: 'active'
        }
      }),
      isValidKey: () => {
        return true; // Always return true since API key is managed server-side
      }
    }),
    {
      name: 'promptduck-api-key'
    }
  )
);
