
import { useMemo } from 'react';
import { useGeneratorStore } from '@/store/generatorStore';
import { usePromptStore } from '@/store/promptStore';

interface PlaygroundSuggestion {
  id: string;
  title: string;
  description: string;
  content: string;
  source: 'recent' | 'remix' | 'library' | 'refined';
  metadata?: {
    heuristics?: string[];
    quality?: number;
  };
}

export function useSmartPlaygroundSuggestions() {
  const { history, lastResult } = useGeneratorStore();
  const { prompts } = usePromptStore();

  const suggestions = useMemo(() => {
    const suggestions: PlaygroundSuggestion[] = [];

    // Recent generated prompts (last 2)
    history.slice(0, 2).forEach((result, index) => {
      suggestions.push({
        id: `recent-${index}`,
        title: result.preview_title,
        description: `Test this generated prompt`,
        content: result.optimized_prompt,
        source: 'recent',
        metadata: {
          heuristics: result.heuristics,
          quality: result.metadata.confidence_score
        }
      });
    });

    // Remix suggestions from last result
    if (lastResult?.remix_suggestions) {
      lastResult.remix_suggestions.slice(0, 2).forEach((remix, index) => {
        suggestions.push({
          id: `remix-${index}`,
          title: `${lastResult.preview_title} (Remix)`,
          description: remix,
          content: `${lastResult.optimized_prompt}. ${remix}`,
          source: 'remix'
        });
      });
    }

    // Popular prompts from library (fallback if we need more)
    if (suggestions.length < 4) {
      const topPrompts = prompts
        .filter(p => p.usage_count > 0)
        .sort((a, b) => b.usage_count - a.usage_count)
        .slice(0, 4 - suggestions.length);

      topPrompts.forEach((prompt, index) => {
        suggestions.push({
          id: `library-${index}`,
          title: prompt.title,
          description: prompt.description || 'Popular prompt from your library',
          content: prompt.content,
          source: 'library'
        });
      });
    }

    // Default suggestions if nothing available
    if (suggestions.length === 0) {
      return [
        {
          id: 'default-1',
          title: 'Write a marketing email',
          description: 'for a new product launch',
          content: 'Write a compelling marketing email for a new product launch that captures attention and drives conversions.',
          source: 'refined' as const
        },
        {
          id: 'default-2',
          title: 'Create a story outline',
          description: 'for a sci-fi adventure',
          content: 'Create a detailed story outline for a science fiction adventure that includes compelling characters and plot twists.',
          source: 'refined' as const
        },
        {
          id: 'default-3',
          title: 'Generate code comments',
          description: 'for better documentation',
          content: 'Generate comprehensive code comments that explain the purpose, parameters, and return values for better code documentation.',
          source: 'refined' as const
        },
        {
          id: 'default-4',
          title: 'Plan a workout routine',
          description: 'for beginners',
          content: 'Plan a comprehensive workout routine for beginners that includes exercises, sets, reps, and progression guidelines.',
          source: 'refined' as const
        }
      ];
    }

    return suggestions.slice(0, 4);
  }, [history, lastResult, prompts]);

  return suggestions;
}
