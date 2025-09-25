import { useEffect, useState } from "react";
import { TurkeyType } from "./TurkeyHuntingGame";
import turkeyStanding from "../assets/turkey-realistic.png";
import turkeyRunning from "../assets/turkey-running.png";

interface TurkeyProps {
  turkey: TurkeyType;
  onHit: (turkeyId: number) => void;
}

export const Turkey = ({ turkey, onHit }: TurkeyProps) => {
  const [hitEffect, setHitEffect] = useState(false);
  const [currentSprite, setCurrentSprite] = useState(turkeyStanding);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!turkey.hit) {
      onHit(turkey.id);
      setHitEffect(true);
    }
  };

  // Animate turkey sprites
  useEffect(() => {
    if (turkey.hit) return;
    
    const spriteInterval = setInterval(() => {
      setCurrentSprite(prev => prev === turkeyStanding ? turkeyRunning : turkeyStanding);
    }, 300);

    return () => clearInterval(spriteInterval);
  }, [turkey.hit]);

  useEffect(() => {
    if (turkey.hit) {
      const timer = setTimeout(() => {
        setHitEffect(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [turkey.hit]);

  return (
    <>
      <div
        className={`absolute cursor-crosshair transition-all duration-300 ${
          turkey.hit 
            ? "animate-hit-effect" 
            : "hover:scale-110 hover:brightness-110"
        }`}
        style={{
          left: `${turkey.x}px`,
          top: `${turkey.y}px`,
          transform: `scale(${turkey.hit ? 0.8 : 1})`,
          filter: turkey.hit ? "grayscale(100%) brightness(0.5)" : "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))",
        }}
        onClick={handleClick}
      >
        <img 
          src={currentSprite}
          alt="Turkey"
          className="w-16 h-16 object-contain select-none"
          style={{
            imageRendering: "pixelated"
          }}
        />
      </div>
      
      {hitEffect && (
        <div
          className="absolute pointer-events-none animate-score-popup font-bold text-2xl bg-gradient-score bg-clip-text text-transparent"
          style={{
            left: `${turkey.x + 20}px`,
            top: `${turkey.y - 10}px`,
          }}
        >
          +10
        </div>
      )}
    </>
  );
};