
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
  sidebarVisible: boolean;
  toggleSidebar: () => void;
  setSidebarVisible: (visible: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarVisible: true,
      toggleSidebar: () => set((state) => ({ sidebarVisible: !state.sidebarVisible })),
      setSidebarVisible: (visible: boolean) => set({ sidebarVisible: visible }),
    }),
    {
      name: 'promptduck-ui-settings'
    }
  )
);
