import { useState, useEffect } from "react";

interface AnimatedTurkeyProps {
  isRunning?: boolean;
  isHit?: boolean;
  scale?: number;
}

export const AnimatedTurkey = ({ isRunning = false, isHit = false, scale = 1 }: AnimatedTurkeyProps) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (isHit) return;
    
    const interval = setInterval(() => {
      setFrame(prev => (prev + 1) % (isRunning ? 4 : 2));
    }, isRunning ? 150 : 800);

    return () => clearInterval(interval);
  }, [isRunning, isHit]);

  const getBodyOffset = () => {
    if (!isRunning) return frame === 0 ? 0 : -1;
    return [0, -2, 0, -1][frame];
  };

  const getLegOffset = () => {
    if (!isRunning) return 0;
    return [0, 2, 0, -2][frame];
  };

  const getWingRotation = () => {
    if (!isRunning) return frame === 0 ? 0 : 2;
    return [0, -5, 0, 5][frame];
  };

  return (
    <svg
      width={64 * scale}
      height={64 * scale}
      viewBox="0 0 64 64"
      className={`${isHit ? "animate-hit-effect" : ""}`}
      style={{
        filter: isHit ? "grayscale(100%) brightness(0.6)" : "none",
        imageRendering: "pixelated",
      }}
    >
      {/* Turkey Body */}
      <ellipse
        cx="32"
        cy={36 + getBodyOffset()}
        rx="18"
        ry="14"
        fill="#8B4513"
        stroke="#654321"
        strokeWidth="1"
      />
      
      {/* Turkey Chest */}
      <ellipse
        cx="32"
        cy={34 + getBodyOffset()}
        rx="12"
        ry="8"
        fill="#A0522D"
      />
      
      {/* Turkey Head */}
      <circle
        cx="32"
        cy={20 + getBodyOffset()}
        r="8"
        fill="#D2691E"
        stroke="#B8860B"
        strokeWidth="1"
      />
      
      {/* Beak */}
      <polygon
        points={`40,${20 + getBodyOffset()} 46,${22 + getBodyOffset()} 40,${24 + getBodyOffset()}`}
        fill="#FFD700"
        stroke="#FFA500"
        strokeWidth="0.5"
      />
      
      {/* Wattle (the red thing under beak) */}
      <ellipse
        cx="32"
        cy={26 + getBodyOffset()}
        rx="3"
        ry="5"
        fill="#DC143C"
      />
      
      {/* Eye */}
      <circle
        cx="36"
        cy={18 + getBodyOffset()}
        r="2"
        fill="#000"
      />
      <circle
        cx="37"
        cy={17 + getBodyOffset()}
        r="0.8"
        fill="#FFF"
      />
      
      {/* Tail Feathers */}
      <g transform={`translate(32, ${36 + getBodyOffset()}) rotate(${getWingRotation()})`}>
        <path
          d="M -18 -2 Q -25 -8 -20 -15 Q -15 -12 -12 -8"
          fill="#8B4513"
          stroke="#654321"
          strokeWidth="0.5"
        />
        <path
          d="M -15 0 Q -22 -5 -18 -12 Q -13 -10 -10 -6"
          fill="#A0522D"
          stroke="#8B4513"
          strokeWidth="0.5"
        />
        <path
          d="M -12 2 Q -18 -3 -15 -10 Q -10 -8 -8 -4"
          fill="#D2691E"
          stroke="#A0522D"
          strokeWidth="0.5"
        />
      </g>
      
      {/* Wings */}
      <g transform={`translate(32, ${30 + getBodyOffset()}) rotate(${getWingRotation() * 0.5})`}>
        <ellipse
          cx="8"
          cy="0"
          rx="10"
          ry="6"
          fill="#654321"
          stroke="#4A4A4A"
          strokeWidth="0.5"
        />
        <ellipse
          cx="6"
          cy="0"
          rx="7"
          ry="4"
          fill="#8B4513"
        />
      </g>
      
      {/* Legs */}
      <g transform={`translate(0, ${getLegOffset()})`}>
        {/* Left Leg */}
        <line
          x1="28"
          y1={48 + getBodyOffset()}
          x2="26"
          y2={58 + getBodyOffset()}
          stroke="#FFA500"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Left Foot */}
        <polygon
          points={`22,${58 + getBodyOffset()} 26,${58 + getBodyOffset()} 30,${60 + getBodyOffset()}`}
          fill="#FFD700"
          stroke="#FFA500"
          strokeWidth="0.5"
        />
        
        {/* Right Leg */}
        <line
          x1="36"
          y1={48 + getBodyOffset()}
          x2="38"
          y2={58 + getBodyOffset()}
          stroke="#FFA500"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Right Foot */}
        <polygon
          points={`34,${60 + getBodyOffset()} 38,${58 + getBodyOffset()} 42,${58 + getBodyOffset()}`}
          fill="#FFD700"
          stroke="#FFA500"
          strokeWidth="0.5"
        />
      </g>
      
      {/* Feather details */}
      <g opacity="0.6">
        <circle cx="28" cy={32 + getBodyOffset()} r="1.5" fill="#654321" />
        <circle cx="36" cy={34 + getBodyOffset()} r="1.5" fill="#654321" />
        <circle cx="32" cy={38 + getBodyOffset()} r="1.5" fill="#654321" />
      </g>
    </svg>
  );
};