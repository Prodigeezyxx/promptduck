
import React, { useState } from 'react';

interface DuckIconProps {
  className?: string;
  size?: number;
  fallback?: React.ReactNode;
}

export function DuckIcon({ className = "", size = 24, fallback }: DuckIconProps) {
  const [hasError, setHasError] = useState(false);

  // Fallback component if SVG fails to render
  const FallbackIcon = () => (
    fallback || (
      <div 
        className={`flex items-center justify-center bg-brand-500 rounded-full ${className}`}
        style={{ width: size, height: size }}
      >
        <span style={{ fontSize: size * 0.6 }}>🦆</span>
      </div>
    )
  );

  if (hasError) {
    return <FallbackIcon />;
  }

  try {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        onError={() => setHasError(true)}
        role="img"
        aria-label="PromptDuck logo"
      >
        <defs>
          {/* Main body gradient - orange to pink to purple to blue */}
          <linearGradient id={`mainGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA500" />
            <stop offset="25%" stopColor="#FF6B35" />
            <stop offset="50%" stopColor="#FF1493" />
            <stop offset="75%" stopColor="#8A2BE2" />
            <stop offset="100%" stopColor="#4169E1" />
          </linearGradient>
          
          {/* Head gradient - warm orange tones */}
          <linearGradient id={`headGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FF6B35" />
          </linearGradient>

          {/* Beak gradient - orange to red */}
          <linearGradient id={`beakGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8C00" />
            <stop offset="100%" stopColor="#FF4500" />
          </linearGradient>
        </defs>

        {/* Shadow/outline */}
        <ellipse cx="52" cy="67" rx="35" ry="20" fill="#2C3E50" opacity="0.2"/>
        <circle cx="32" cy="35" r="22" fill="#2C3E50" opacity="0.2"/>
        
        {/* Duck body with vibrant gradient */}
        <ellipse cx="50" cy="65" rx="33" ry="18" fill={`url(#mainGradient-${size})`} stroke="#2C3E50" strokeWidth="2"/>
        
        {/* Duck head */}
        <circle cx="30" cy="33" r="20" fill={`url(#headGradient-${size})`} stroke="#2C3E50" strokeWidth="2"/>
        
        {/* Duck beak */}
        <path d="M10 33 Q5 30 8 36 Q12 38 10 33 Z" fill={`url(#beakGradient-${size})`} stroke="#2C3E50" strokeWidth="1.5"/>
        
        {/* Duck eye */}
        <circle cx="28" cy="28" r="3" fill="#2C3E50"/>
        <circle cx="29" cy="27" r="1" fill="white"/>
        
        {/* Wing highlight with same gradient */}
        <ellipse cx="55" cy="55" rx="12" ry="8" fill={`url(#mainGradient-${size})`} opacity="0.8" stroke="#2C3E50" strokeWidth="1"/>
      </svg>
    );
  } catch (error) {
    console.warn('DuckIcon failed to render, using fallback:', error);
    return <FallbackIcon />;
  }
}
