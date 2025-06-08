
import { useState, useEffect } from 'react';
import { ANIMATED_PROMPTS } from '@/constants/animatedPrompts';

export function AnimatedPromptDisplay() {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [promptIndex, setPromptIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullPrompt = ANIMATED_PROMPTS[promptIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (charIndex < currentFullPrompt.length) {
          setCurrentPrompt(currentFullPrompt.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (charIndex > 0) {
          setCurrentPrompt(currentFullPrompt.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          // Finished deleting, move to next prompt
          setIsDeleting(false);
          setPromptIndex((promptIndex + 1) % ANIMATED_PROMPTS.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timer);
  }, [currentPrompt, promptIndex, charIndex, isDeleting]);

  return (
    <div className="max-w-2xl mx-auto mt-8 lg:mt-12">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
        {/* Editor window header */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">PromptDuck Editor</span>
        </div>
        
        {/* Code content area */}
        <div className="min-h-[80px] font-mono text-sm">
          <span className="text-gray-500 dark:text-gray-400">prompt:</span>{' '}
          <span className="text-gray-900 dark:text-gray-100">{currentPrompt}</span>
          <span className="animate-pulse text-brand-500">|</span>
        </div>
      </div>
    </div>
  );
}
