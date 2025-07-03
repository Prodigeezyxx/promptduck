import { useEffect } from 'react';
import { usePromptStore } from '@/store/promptStore';
import { useGeneratorStore } from '@/store/generatorStore';
import { GenerationResult } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useTemplateLoader() {
  const { currentPrompt } = usePromptStore();
  const { setLastResult } = useGeneratorStore();

  // Helper function to convert prompt difficulty to generation complexity
  const mapDifficultyToComplexity = (difficulty: string | undefined): 'simple' | 'intermediate' | 'advanced' => {
    switch (difficulty) {
      case 'beginner':
        return 'simple';
      case 'intermediate':
        return 'intermediate';
      case 'advanced':
        return 'advanced';
      default:
        return 'intermediate';
    }
  };

  // Enhanced template loading logic to handle existing prompts better
  useEffect(() => {
    if (currentPrompt) {
      console.log('Loading template into generator:', currentPrompt.title);
      
      // Smart intent extraction based on available data
      let originalIntent = '';
      let originalContext = '';

      // Try to get meaningful intent from description first
      if (currentPrompt.description && 
          currentPrompt.description !== 'AI Generated Prompt' && 
          currentPrompt.description.trim() !== '') {
        originalIntent = currentPrompt.description;
      } else {
        // Fallback: extract intent from title or content
        originalIntent = currentPrompt.title;
        
        // If title is also generic, try to extract from content
        if (currentPrompt.title.includes('AI Generated') || currentPrompt.title.includes('Copy')) {
          const contentLines = currentPrompt.content.split('\n').filter(line => line.trim());
          const meaningfulLine = contentLines.find(line => 
            !line.startsWith('#') && 
            !line.includes('Context:') && 
            !line.includes('Role:') &&
            line.length > 20
          );
          if (meaningfulLine) {
            originalIntent = meaningfulLine.slice(0, 100);
          }
        }
      }

      // Try to extract context from variables
      const contextVariable = currentPrompt.variables?.find(v => 
        v.name === 'original_context' || 
        v.name.includes('context') ||
        v.description?.length > 10
      );
      
      if (contextVariable?.description) {
        originalContext = contextVariable.description;
      }
      
      // Create a GenerationResult from the saved template data
      const templateResult: GenerationResult = {
        result: currentPrompt.content,
        optimized_prompt: currentPrompt.content,
        preview_title: currentPrompt.title,
        tags: currentPrompt.tags || ['template'],
        heuristics: currentPrompt.heuristics || [],
        variables: currentPrompt.variables || [],
        metadata: {
          intent: originalIntent,
          context: originalContext,
          complexity: mapDifficultyToComplexity(currentPrompt.difficulty),
          heuristics: currentPrompt.heuristics || []
        },
        remix_suggestions: []
      };
      
      // Set the template content as the last result so it displays immediately
      setLastResult(templateResult);
      
      toast({ 
        title: 'Template loaded!', 
        description: `"${currentPrompt.title}" content has been loaded and is ready for use.` 
      });
    }
  }, [currentPrompt, setLastResult]);

  return { currentPrompt };
}