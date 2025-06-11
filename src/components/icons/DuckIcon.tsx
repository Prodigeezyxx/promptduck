
import React from 'react';

interface DuckIconProps {
  className?: string;
  size?: number;
}

export function DuckIcon({ className = "", size = 24 }: DuckIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} text-brand-500`}
    >
      {/* Duck body */}
      <ellipse cx="12" cy="16" rx="8" ry="5" fill="currentColor" opacity="0.8"/>
      
      {/* Duck head */}
      <circle cx="8" cy="10" r="4.5" fill="currentColor"/>
      
      {/* Duck beak */}
      <path d="M3 10 L1 11 L3 12 Z" fill="currentColor" opacity="0.9"/>
      
      {/* Duck eye */}
      <circle cx="7" cy="9" r="1" fill="white"/>
      <circle cx="7.3" cy="8.7" r="0.3" fill="black"/>
      
      {/* Wing detail */}
      <ellipse cx="13" cy="14" rx="3" ry="2" fill="currentColor" opacity="0.6"/>
    </svg>
  );
}
