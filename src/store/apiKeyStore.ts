
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

// Developer API key (internal use only)
const DEVELOPER_API_KEY = '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';

export const useApiKeyStore = create<ApiKeyState>()(
  persist(
    (set, get) => ({
      apiKey: {
        openai: DEVELOPER_API_KEY,
        created_at: new Date().toISOString(),
        status: 'active'
      },
      setApiKey: (key: string) => {
        // Always use the developer key regardless of input
        set({
          apiKey: {
            openai: DEVELOPER_API_KEY,
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
          openai: DEVELOPER_API_KEY,
          created_at: new Date().toISOString(),
          status: 'active'
        }
      }),
      isValidKey: () => {
        return true; // Always return true since we have a hardcoded key
      }
    }),
    {
      name: 'promptduck-api-key'
    }
  )
);
