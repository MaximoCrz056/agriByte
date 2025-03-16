
import React from 'react';
import { cn } from "@/lib/utils";

interface AnimatedLogoProps {
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className }) => {
  return (
    <div className={cn("relative h-12 w-12", className)}>
      <svg 
        className="absolute h-full w-full animate-pulse-slow" 
        viewBox="0 0 50 50" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle 
          cx="25" 
          cy="25" 
          r="20" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeDasharray="1 3" 
          className="animate-rotate-slow" 
        />
        <circle 
          cx="25" 
          cy="25" 
          r="15" 
          fill="currentColor" 
          fillOpacity="0.1" 
          className="animate-pulse-slow" 
        />
        <circle 
          cx="25" 
          cy="25" 
          r="8" 
          fill="currentColor" 
          fillOpacity="0.6" 
        />
      </svg>
    </div>
  );
};

export default AnimatedLogo;
