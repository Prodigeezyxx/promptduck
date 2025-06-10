
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
const DEVELOPER_API_KEY = 'AIzaSyDsMeWL6kVCiO_zyujZClhYWhOKfz5nXQc';

export const useApiKeyStore = create<ApiKeyState>()(
  persist(
    (set, get) => ({
      apiKey: {
        gemini: DEVELOPER_API_KEY,
        created_at: new Date().toISOString(),
        status: 'active'
      },
      setApiKey: (key: string) => {
        // Always use the developer key regardless of input
        set({
          apiKey: {
            gemini: DEVELOPER_API_KEY,
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
          gemini: DEVELOPER_API_KEY,
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
