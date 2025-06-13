
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

// Detect system preference for initial theme (default to dark for new design system)
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    // Check for stored preference first
    const stored = localStorage.getItem('promptduck-theme');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.theme || 'dark';
    }
    
    // Default to dark mode to showcase the new design system
    return 'dark';
  }
  return 'dark';
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
