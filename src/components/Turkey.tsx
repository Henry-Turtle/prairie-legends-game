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
        className={`absolute cursor-crosshair transition-all duration-75 ${
          turkey.hit ? "opacity-0 scale-150" : "hover:scale-110"
        }`}
        style={{
          left: `${turkey.x}px`,
          top: `${turkey.y}px`,
          transform: turkey.hit ? "rotate(180deg)" : "none",
        }}
        onClick={handleClick}
      >
        <div className="text-4xl select-none">
          🦃
        </div>
      </div>
      
      {hitEffect && (
        <div
          className="absolute pointer-events-none animate-score-popup text-autumn-gold font-bold text-2xl"
          style={{
            left: `${turkey.x + 20}px`,
            top: `${turkey.y}px`,
          }}
        >
          +10
        </div>
      )}
    </>
  );
};