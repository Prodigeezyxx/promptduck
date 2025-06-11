
import { memo, useEffect, useRef } from 'react';

const MatrixRain = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Create matrix columns
    for (let i = 0; i < 50; i++) {
      const column = document.createElement('div');
      column.className = 'matrix-column';
      column.style.left = `${(i * 2)}%`;
      column.style.animationDuration = `${2.5 + Math.random() * 2}s`;
      column.style.animationDelay = `${Math.random() * 5}s`;
      
      // Add characters to the column
      const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
      let text = '';
      for (let j = 0; j < 20; j++) {
        text += chars[Math.floor(Math.random() * chars.length)] + '\n';
      }
      column.textContent = text;
      
      container.appendChild(column);
    }
  }, []);

  return (
    <div className="matrix-container">
      <div ref={containerRef} className="matrix-pattern"></div>
    </div>
  );
});

MatrixRain.displayName = 'MatrixRain';

export default MatrixRain;
