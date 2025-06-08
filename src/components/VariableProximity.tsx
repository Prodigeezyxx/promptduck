
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VariableProximityProps {
  text: string;
  className?: string;
}

export function VariableProximity({ text, className = '' }: VariableProximityProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const words = text.split(' ');

  return (
    <div className={`${className} flex flex-wrap gap-2 justify-center`}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="variable-proximity inline-block cursor-default"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          animate={{
            scale: hoveredIndex === index ? 1.1 : 1,
            color: hoveredIndex === index ? '#6366f1' : undefined,
            textShadow: hoveredIndex === index ? '0 0 20px rgba(99, 102, 241, 0.5)' : '0 0 0px rgba(99, 102, 241, 0)',
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
