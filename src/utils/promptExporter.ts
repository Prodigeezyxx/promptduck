
import { Prompt } from '@/types';

export interface ExportedPrompt {
  title: string;
  description: string;
  instruction: string;
  keywords: string[];
  output_tone: string;
  constraints: {
    avoid: string[];
    prioritize: string[];
  };
  metadata: {
    persona: string;
    heuristics: string[];
    category: string;
    version: number;
    created_at: string;
    usage_count: number;
  };
}

export function convertPromptToExportFormat(prompt: Prompt): ExportedPrompt {
  return {
    title: prompt.title,
    description: prompt.description || prompt.content.slice(0, 120) + '...',
    instruction: prompt.content,
    keywords: prompt.tags,
    output_tone: 'technical', // Default value
    constraints: {
      avoid: ['roleplay', 'whimsy', 'emotional tone'],
      prioritize: ['clarity', 'accuracy', 'step-by-step logic', 'practicality']
    },
    metadata: {
      persona: prompt.persona,
      heuristics: prompt.heuristics,
      category: prompt.category,
      version: prompt.version,
      created_at: prompt.created_at,
      usage_count: prompt.usage_count
    }
  };
}

export function downloadPromptAsJSON(prompt: Prompt) {
  const exportedPrompt = convertPromptToExportFormat(prompt);
  const jsonContent = JSON.stringify(exportedPrompt, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${prompt.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}
