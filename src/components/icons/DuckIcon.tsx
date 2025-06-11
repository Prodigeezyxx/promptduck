
import React from 'react';
import { Bird } from 'lucide-react';

interface DuckIconProps {
  className?: string;
  size?: number;
}

export function DuckIcon({ className = "", size = 24 }: DuckIconProps) {
  return (
    <Bird 
      size={size}
      className={`${className} text-brand-500`}
    />
  );
}
