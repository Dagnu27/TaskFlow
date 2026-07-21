import React, { useEffect, useState } from 'react';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  id?: string;
}

export default function ProgressRing({ percentage, size = 64, strokeWidth = 6, id = "progress-ring" }: ProgressRingProps) {
  const [offset, setOffset] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    // Animate stroke fill-in on load
    const timer = setTimeout(() => {
      const progressOffset = circumference - (percentage / 100) * circumference;
      setOffset(progressOffset);
    }, 150);
    return () => clearTimeout(timer);
  }, [percentage, circumference]);

  return (
    <div id={id} className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Define Gradient */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />   {/* Violet */}
            <stop offset="50%" stopColor="#EC4899" />  {/* Pink */}
            <stop offset="100%" stopColor="#F97316" /> {/* Orange */}
          </linearGradient>
        </defs>
        
        {/* Background Ring */}
        <circle
          className="text-slate-100"
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        
        {/* Foreground Progress Ring with transition */}
        <circle
          stroke="url(#progressGradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={isNaN(offset) ? circumference : offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      
      {/* Central Text percentage indicator with custom font */}
      <span className="absolute font-display font-black text-xs text-slate-900">
        {percentage}%
      </span>
    </div>
  );
}
