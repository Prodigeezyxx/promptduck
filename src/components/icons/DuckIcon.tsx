
import React from 'react';

interface DuckIconProps {
  className?: string;
  size?: number;
}

export function DuckIcon({ className = "", size = 24 }: DuckIconProps) {
  return (
    <img
      src="/lovable-uploads/3bdd5661-964e-4d4a-95eb-f3a015020b90.png"
      alt="PromptDuck Logo"
      width={size}
      height={size}
      className={`${className} object-contain`}
      style={{ width: size, height: size }}
    />
  );
}
