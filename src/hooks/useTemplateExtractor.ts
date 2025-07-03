import { usePromptStore } from '@/store/promptStore';

export function useTemplateExtractor() {
  const { currentPrompt } = usePromptStore();

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

  const extractTemplateData = () => {
    if (!currentPrompt) return { originalIntent: '', originalContext: '' };

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

    return { originalIntent, originalContext };
  };

  return {
    currentPrompt,
    extractTemplateData,
    mapDifficultyToComplexity
  };
}