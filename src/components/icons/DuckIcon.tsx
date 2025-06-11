
import React from 'react';

interface DuckIconProps {
  className?: string;
  size?: number;
}

export function DuckIcon({ className = "", size = 24 }: DuckIconProps) {
  return (
    <img
      src="/lovable-uploads/f532bc4c-6a57-4c7e-9651-92160c2b7ab1.png"
      alt="PromptDuck Logo"
      width={size}
      height={size}
      className={`${className} object-contain`}
      style={{ width: size, height: size }}
    />
  );
}
