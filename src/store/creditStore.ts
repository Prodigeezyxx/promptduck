
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Credit } from '@/types';
import { DAILY_CREDIT_LIMIT } from '@/constants';

interface CreditState {
  credits: Credit;
  useCredit: () => boolean;
  resetCreditsIfNewDay: () => void;
  getRemainingCredits: () => number;
  canUseCredit: () => boolean;
}

export const useCreditStore = create<CreditState>()(
  persist(
    (set, get) => ({
      credits: {
        used: 0,
        limit: DAILY_CREDIT_LIMIT,
        resetTime: Date.now() + 24 * 60 * 60 * 1000,
        daily_limit: DAILY_CREDIT_LIMIT,
        used_today: 0,
        last_reset: new Date().toDateString(),
        premium: false
      },
      useCredit: () => {
        const state = get();
        state.resetCreditsIfNewDay();
        
        if (!state.canUseCredit()) {
          return false;
        }

        set(state => ({
          credits: {
            ...state.credits,
            used: state.credits.used + 1,
            used_today: state.credits.used_today + 1
          }
        }));
        return true;
      },
      resetCreditsIfNewDay: () => {
        const today = new Date().toDateString();
        const state = get();
        
        if (state.credits.last_reset !== today) {
          set(state => ({
            credits: {
              ...state.credits,
              used_today: 0,
              last_reset: today,
              daily_limit: DAILY_CREDIT_LIMIT,
              resetTime: Date.now() + 24 * 60 * 60 * 1000
            }
          }));
        }
      },
      getRemainingCredits: () => {
        const state = get();
        state.resetCreditsIfNewDay();
        return state.credits.daily_limit - state.credits.used_today;
      },
      canUseCredit: () => {
        const state = get();
        return state.credits.used_today < state.credits.daily_limit || state.credits.premium;
      }
    }),
    {
      name: 'promptduck-credits'
    }
  )
);
