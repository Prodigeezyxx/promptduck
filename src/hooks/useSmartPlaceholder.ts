
import { useEffect, useState } from 'react';

const SMART_PLACEHOLDERS = {
  simple: [
    "Write a social media post about...",
    "Create a product description for...",
    "Generate an email subject line for...",
    "Write a brief summary of..."
  ],
  intermediate: [
    "Develop a comprehensive content strategy for...",
    "Create a detailed analysis of...",
    "Generate a step-by-step guide for...",
    "Write a persuasive article about..."
  ],
  advanced: [
    "Design a multi-layered narrative framework that...",
    "Construct a comprehensive research methodology for...",
    "Develop an advanced algorithmic approach to...",
    "Create a sophisticated analytical model for..."
  ]
};

export function useSmartPlaceholder(complexity: 'simple' | 'intermediate' | 'advanced', type: 'intent' | 'context' = 'intent') {
  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
    if (type === 'intent') {
      const placeholders = SMART_PLACEHOLDERS[complexity];
      const randomPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];
      setPlaceholder(randomPlaceholder);
    } else {
      const contextPlaceholders = {
        simple: "Add any specific requirements or constraints...",
        intermediate: "Provide additional context, target audience, tone, or specific requirements...",
        advanced: "Include detailed context, constraints, methodology preferences, evaluation criteria, and any domain-specific requirements..."
      };
      setPlaceholder(contextPlaceholders[complexity]);
    }
  }, [complexity, type]);

  return placeholder;
}
