import { useEffect, useState } from "react";
import { TurkeyType } from "./TurkeyHuntingGame";

interface TurkeyProps {
  turkey: TurkeyType;
  onHit: (turkeyId: number) => void;
}

export const Turkey = ({ turkey, onHit }: TurkeyProps) => {
  const [hitEffect, setHitEffect] = useState(false);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!turkey.hit) {
      onHit(turkey.id);
      setHitEffect(true);
    }
  };

  useEffect(() => {
    if (turkey.hit) {
      const timer = setTimeout(() => {
        setHitEffect(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [turkey.hit]);

  return (
    <>
      <div
        className={`absolute cursor-crosshair transition-all duration-200 ${
          turkey.hit 
            ? "animate-hit-effect" 
            : "hover:scale-110 hover:drop-shadow-glow animate-turkey-idle"
        }`}
        style={{
          left: `${turkey.x}px`,
          top: `${turkey.y}px`,
          filter: turkey.hit ? "hue-rotate(180deg) brightness(0.5)" : "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
        }}
        onClick={handleClick}
      >
        <div className="text-5xl select-none transform transition-transform duration-200">
          🦃
        </div>
      </div>
      
      {hitEffect && (
        <div
          className="absolute pointer-events-none animate-score-popup font-bold text-3xl bg-gradient-score bg-clip-text text-transparent drop-shadow-glow"
          style={{
            left: `${turkey.x + 25}px`,
            top: `${turkey.y - 10}px`,
          }}
        >
          +10
        </div>
      )}
      
      {turkey.hit && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${turkey.x + 10}px`,
            top: `${turkey.y + 15}px`,
          }}
        >
          <div className="text-2xl animate-score-popup">💥</div>
        </div>
      )}
    </>
  );
};