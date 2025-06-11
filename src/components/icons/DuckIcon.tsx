
import React from 'react';

interface DuckIconProps {
  className?: string;
  size?: number;
}

export function DuckIcon({ className = "", size = 24 }: DuckIconProps) {
  const imagePath = "/lovable-uploads/eb95d4b6-dc5c-4694-a867-cbb6caefa746.png";
  
  console.log('DuckIcon rendering with path:', imagePath);
  
  return (
    <img
      src={imagePath}
      alt="PromptDuck Logo"
      width={size}
      height={size}
      className={`${className} object-contain`}
      style={{ width: size, height: size }}
      onLoad={() => console.log('Logo loaded successfully')}
      onError={(e) => {
        console.error('Logo failed to load:', e);
        console.error('Attempted path:', imagePath);
      }}
    />
  );
}
