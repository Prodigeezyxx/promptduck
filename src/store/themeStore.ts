
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

// Detect system preference for initial theme
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    // Check for stored preference first
    const stored = localStorage.getItem('promptduck-theme');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.theme || 'dark';
    }
    
    // Fallback to system preference, defaulting to dark
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
  }
  return 'dark'; // Default to dark mode
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: getInitialTheme(),
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document immediately
        if (typeof document !== 'undefined') {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },
    }),
    {
      name: 'promptduck-theme',
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== 'undefined') {
          state.setTheme(state.theme);
        }
      },
    }
  )
);
