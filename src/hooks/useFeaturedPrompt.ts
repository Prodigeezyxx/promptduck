
import { useState, useEffect } from 'react';
import { FEATURED_PROMPTS } from '@/constants/featuredPrompts';
import { Prompt } from '@/types';

const FEATURED_PROMPT_SESSION_KEY = 'promptduck_featured_prompt_session';
const LAST_FEATURED_ID_KEY = 'promptduck_last_featured_id';

export function useFeaturedPrompt() {
  const [featuredPrompt, setFeaturedPrompt] = useState<Prompt | null>(null);

  useEffect(() => {
    // Check if we need to rotate the featured prompt for this session
    const currentSession = sessionStorage.getItem(FEATURED_PROMPT_SESSION_KEY);
    const currentTime = Date.now().toString();
    
    if (currentSession !== currentTime.slice(0, -6)) { // New session (different hour)
      selectNewFeaturedPrompt();
      sessionStorage.setItem(FEATURED_PROMPT_SESSION_KEY, currentTime.slice(0, -6));
    } else {
      // Use existing featured prompt from this session
      const lastFeaturedId = localStorage.getItem(LAST_FEATURED_ID_KEY);
      const existing = FEATURED_PROMPTS.find(p => p.id === lastFeaturedId);
      setFeaturedPrompt(existing || FEATURED_PROMPTS[0]);
    }
  }, []);

  const selectNewFeaturedPrompt = () => {
    if (FEATURED_PROMPTS.length === 0) return;

    const lastFeaturedId = localStorage.getItem(LAST_FEATURED_ID_KEY);
    
    // Get available prompts excluding the last featured one
    const availablePrompts = FEATURED_PROMPTS.filter(p => p.id !== lastFeaturedId);
    
    if (availablePrompts.length === 0) {
      // If only one prompt or all filtered out, use the first one
      setFeaturedPrompt(FEATURED_PROMPTS[0]);
      localStorage.setItem(LAST_FEATURED_ID_KEY, FEATURED_PROMPTS[0].id);
      return;
    }

    // Smart selection based on variety criteria
    const selected = selectByVariety(availablePrompts, lastFeaturedId);
    setFeaturedPrompt(selected);
    localStorage.setItem(LAST_FEATURED_ID_KEY, selected.id);
  };

  const selectByVariety = (availablePrompts: Prompt[], lastFeaturedId: string | null): Prompt => {
    // Try to select a prompt from a different category than the last one
    if (lastFeaturedId) {
      const lastPrompt = FEATURED_PROMPTS.find(p => p.id === lastFeaturedId);
      if (lastPrompt) {
        const differentCategory = availablePrompts.filter(p => p.category !== lastPrompt.category);
        if (differentCategory.length > 0) {
          return differentCategory[Math.floor(Math.random() * differentCategory.length)];
        }
      }
    }

    // Fallback to random selection
    return availablePrompts[Math.floor(Math.random() * availablePrompts.length)];
  };

  const forceRotation = () => {
    selectNewFeaturedPrompt();
  };

  return {
    featuredPrompt,
    forceRotation
  };
}
