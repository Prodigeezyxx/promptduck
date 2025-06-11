
import React from 'react';

interface DuckIconProps {
  className?: string;
  size?: number;
}

export function DuckIcon({ className = "", size = 24 }: DuckIconProps) {
  return (
    <img
      src="/lovable-uploads/eb95d4b6-dc5c-4694-a867-cbb6caefa746.png"
      alt="PromptDuck Logo"
      width={size}
      height={size}
      className={`${className} object-contain`}
      style={{ width: size, height: size }}
    />
  );
}
