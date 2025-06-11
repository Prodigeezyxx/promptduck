
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
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Body gradient from orange to purple */}
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="30%" stopColor="#FF8E53" />
          <stop offset="60%" stopColor="#9B59B6" />
          <stop offset="100%" stopColor="#3498DB" />
        </linearGradient>
        
        {/* Head gradient */}
        <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB347" />
          <stop offset="50%" stopColor="#FF8C42" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>

        {/* Beak gradient */}
        <linearGradient id="beakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E74C3C" />
          <stop offset="100%" stopColor="#C0392B" />
        </linearGradient>
      </defs>

      {/* Dark outline/shadow */}
      <ellipse cx="52" cy="67" rx="35" ry="20" fill="#2C3E50" opacity="0.3"/>
      <circle cx="32" cy="35" r="22" fill="#2C3E50" opacity="0.3"/>
      
      {/* Duck body */}
      <ellipse cx="50" cy="65" rx="33" ry="18" fill="url(#bodyGradient)" stroke="#2C3E50" strokeWidth="2"/>
      
      {/* Duck head */}
      <circle cx="30" cy="33" r="20" fill="url(#headGradient)" stroke="#2C3E50" strokeWidth="2"/>
      
      {/* Duck beak */}
      <path d="M10 33 Q5 30 8 36 Q12 38 10 33 Z" fill="url(#beakGradient)" stroke="#2C3E50" strokeWidth="1.5"/>
      
      {/* Duck eye */}
      <circle cx="28" cy="28" r="3" fill="#2C3E50"/>
      <circle cx="29" cy="27" r="1" fill="white"/>
      
      {/* Wing highlight */}
      <ellipse cx="55" cy="55" rx="12" ry="8" fill="url(#bodyGradient)" opacity="0.7" stroke="#2C3E50" strokeWidth="1"/>
    </svg>
  );
}
