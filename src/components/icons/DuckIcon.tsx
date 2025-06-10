
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
      className={className}
    >
      <path
        d="M8.5 5C8.5 3.61929 9.61929 2.5 11 2.5C12.3807 2.5 13.5 3.61929 13.5 5C13.5 5.69 13.81 6.31 14.3 6.73C15.41 7.68 16 9.05 16 10.5V12H18C19.66 12 21 13.34 21 15C21 16.66 19.66 18 18 18H6C4.34 18 3 16.66 3 15C3 13.34 4.34 12 6 12H7V10.5C7 8.57 8.57 7 10.5 7C9.12 7 8 5.88 8 4.5H8.5V5Z"
        fill="currentColor"
      />
      <circle cx="11" cy="8" r="1" fill="white" />
      <path
        d="M14 10C14.5523 10 15 9.55228 15 9C15 8.44772 14.5523 8 14 8C13.4477 8 13 8.44772 13 9C13 9.55228 13.4477 10 14 10Z"
        fill="orange"
      />
    </svg>
  );
}
