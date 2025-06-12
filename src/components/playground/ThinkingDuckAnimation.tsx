
import { useState, useEffect } from 'react';
import { DuckIcon } from '@/components/icons/DuckIcon';

export function ThinkingDuckAnimation() {
  const [animationPhase, setAnimationPhase] = useState<'thinking' | 'pondering' | 'lightbulb'>('thinking');

  useEffect(() => {
    const phases: ('thinking' | 'pondering' | 'lightbulb')[] = ['thinking', 'pondering', 'lightbulb'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % phases.length;
      setAnimationPhase(phases[currentIndex]);
    }, 1200); // Change phase every 1.2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Main Duck Icon with breathing animation */}
      <div className="animate-pulse">
        <DuckIcon 
          size={20} 
          className="text-white drop-shadow-sm transition-transform duration-300 hover:scale-110" 
        />
      </div>

      {/* Thought bubbles */}
      {animationPhase === 'thinking' && (
        <div className="absolute -top-1 -right-1">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}

      {/* Pondering state with rotating dots */}
      {animationPhase === 'pondering' && (
        <div className="absolute -top-2 -right-2">
          <div className="relative w-4 h-4">
            <div className="absolute inset-0 animate-spin">
              <div className="w-1 h-1 bg-white/70 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
              <div className="w-1 h-1 bg-white/60 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2"></div>
              <div className="w-1 h-1 bg-white/50 rounded-full absolute left-0 top-1/2 transform -translate-y-1/2"></div>
              <div className="w-1 h-1 bg-white/40 rounded-full absolute right-0 top-1/2 transform -translate-y-1/2"></div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbulb moment with sparkle */}
      {animationPhase === 'lightbulb' && (
        <div className="absolute -top-1 -right-1">
          <div className="animate-ping">
            <div className="w-2 h-2 bg-yellow-300 rounded-full opacity-75"></div>
          </div>
          <div className="absolute top-0 right-0 w-2 h-2">
            <div className="w-full h-full bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Gentle floating animation for the entire container */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes gentle-float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-2px) rotate(1deg); }
          }
          .animate-gentle-float {
            animation: gentle-float 2s ease-in-out infinite;
          }
        `
      }} />
    </div>
  );
}
