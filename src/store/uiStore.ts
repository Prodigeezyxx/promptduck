
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
  leftPaneVisible: boolean;
  toggleLeftPane: () => void;
  setLeftPaneVisible: (visible: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      leftPaneVisible: true,
      toggleLeftPane: () => set((state) => ({ leftPaneVisible: !state.leftPaneVisible })),
      setLeftPaneVisible: (visible: boolean) => set({ leftPaneVisible: visible }),
    }),
    {
      name: 'promptduck-ui-settings'
    }
  )
);
