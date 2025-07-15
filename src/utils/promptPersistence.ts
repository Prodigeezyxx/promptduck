const PROMPT_STORAGE_KEY = 'promptduck_landing_prompt';
const REDIRECT_STORAGE_KEY = 'promptduck_post_auth_redirect';

export interface StoredPrompt {
  prompt: string;
  timestamp: number;
  requiresAuth: boolean;
}

export interface RedirectInfo {
  path: string;
  prompt?: string;
  timestamp: number;
}

export const promptPersistence = {
  // Store a prompt from the landing page
  storePrompt: (prompt: string, requiresAuth: boolean = false): void => {
    const storedPrompt: StoredPrompt = {
      prompt,
      timestamp: Date.now(),
      requiresAuth
    };
    
    try {
      localStorage.setItem(PROMPT_STORAGE_KEY, JSON.stringify(storedPrompt));
    } catch (error) {
      console.warn('Failed to store prompt:', error);
    }
  },

  // Get stored prompt
  getStoredPrompt: (): StoredPrompt | null => {
    try {
      const stored = localStorage.getItem(PROMPT_STORAGE_KEY);
      if (!stored) return null;
      
      const parsed: StoredPrompt = JSON.parse(stored);
      
      // Check if prompt is less than 1 hour old
      const oneHour = 60 * 60 * 1000;
      if (Date.now() - parsed.timestamp > oneHour) {
        promptPersistence.clearPrompt();
        return null;
      }
      
      return parsed;
    } catch (error) {
      console.warn('Failed to retrieve stored prompt:', error);
      promptPersistence.clearPrompt();
      return null;
    }
  },

  // Clear stored prompt
  clearPrompt: (): void => {
    try {
      localStorage.removeItem(PROMPT_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear stored prompt:', error);
    }
  },

  // Store redirect info for post-auth navigation
  storeRedirectInfo: (path: string, prompt?: string): void => {
    const redirectInfo: RedirectInfo = {
      path,
      prompt,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem(REDIRECT_STORAGE_KEY, JSON.stringify(redirectInfo));
    } catch (error) {
      console.warn('Failed to store redirect info:', error);
    }
  },

  // Get and clear redirect info
  getAndClearRedirectInfo: (): RedirectInfo | null => {
    try {
      const stored = localStorage.getItem(REDIRECT_STORAGE_KEY);
      if (!stored) return null;
      
      const parsed: RedirectInfo = JSON.parse(stored);
      
      // Check if redirect info is less than 10 minutes old
      const tenMinutes = 10 * 60 * 1000;
      if (Date.now() - parsed.timestamp > tenMinutes) {
        localStorage.removeItem(REDIRECT_STORAGE_KEY);
        return null;
      }
      
      // Clear after reading
      localStorage.removeItem(REDIRECT_STORAGE_KEY);
      return parsed;
    } catch (error) {
      console.warn('Failed to retrieve redirect info:', error);
      localStorage.removeItem(REDIRECT_STORAGE_KEY);
      return null;
    }
  }
};