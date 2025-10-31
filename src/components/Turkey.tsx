import { useEffect, useState, memo } from "react";
import { TurkeyType } from "./TurkeyHuntingGame";
import { AnimatedTurkey } from "./AnimatedTurkey";

interface TurkeyProps {
  turkey: TurkeyType;
  onHit: (turkeyId: number) => void;
}

export const Turkey = memo(({ turkey, onHit }: TurkeyProps) => {
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
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [turkey.hit]);

  return (
    <>
      <div
        className={`absolute cursor-crosshair transition-all duration-300 ${
          turkey.hit 
            ? "opacity-70 scale-90" 
            : "hover:scale-110 hover:brightness-110"
        }`}
        style={{
          left: `${turkey.x}px`,
          top: `${turkey.y}px`,
          filter: turkey.hit ? "contrast(150%) saturate(50%)" : "drop-shadow(2px 2px 4px rgba(0,0,0,0.4))",
          transform: turkey.direction === 'left' || turkey.direction === 'diagonal-up' && turkey.x > window.innerWidth / 2 || turkey.direction === 'diagonal-down' && turkey.x > window.innerWidth / 2 
            ? "scaleX(-1)" 
            : "scaleX(1)",
        }}
        onClick={handleClick}
      >
        <AnimatedTurkey 
          isRunning={true} 
          isHit={turkey.hit}
          scale={1.2}
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
      
      {turkey.hit && (
        <div
          className="absolute pointer-events-none animate-score-popup"
          style={{
            left: `${turkey.x + 15}px`,
            top: `${turkey.y + 10}px`,
          }}
        >
          <span className="text-2xl">💥</span>
        </div>
      )}
    </>
  );
});