
import { useState, useEffect } from 'react';

interface UseTypingAnimationProps {
  text: string;
  speed?: number;
  isActive: boolean;
}

export function useTypingAnimation({ text, speed = 1, isActive }: UseTypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isActive || !text) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    setDisplayedText('');
    
    let currentIndex = 0;
    
    // Check if mobile device for 2x speed
    const isMobile = window.innerWidth < 768;
    const adjustedSpeed = isMobile ? speed / 2 : speed; // 2x faster on mobile
    
    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, adjustedSpeed);

    return () => clearInterval(timer);
  }, [text, speed, isActive]);

  return { displayedText, isTyping };
}
