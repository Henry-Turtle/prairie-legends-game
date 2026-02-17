import { useEffect, useState, useMemo } from "react";
import { TurkeyType } from "./TurkeyHuntingGame";
import { AnimatedTurkey } from "./AnimatedTurkey";

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
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [turkey.hit]);

  // Memoize color filter based on hit status and type
  const colorFilter = useMemo(() => {
    if (turkey.hit) return "contrast(150%) saturate(50%)";

    switch (turkey.type) {
      case 'yellow':
        return "drop-shadow(2px 2px 4px rgba(0,0,0,0.4)) sepia(100%) saturate(300%) brightness(120%) hue-rotate(10deg)";
      case 'green':
        return "drop-shadow(2px 2px 4px rgba(0,0,0,0.4)) sepia(100%) saturate(200%) brightness(90%) hue-rotate(60deg)";
      default:
        return "drop-shadow(2px 2px 4px rgba(0,0,0,0.4))";
    }
  }, [turkey.hit, turkey.type]);

  const halfWidth = window.innerWidth / 2;
  const shouldFlip = turkey.direction === 'left' ||
    (turkey.direction === 'diagonal-up' && turkey.x > halfWidth) ||
    (turkey.direction === 'diagonal-down' && turkey.x > halfWidth);

  return (
    <>
      <div
        className={`absolute cursor-crosshair transition-[opacity,filter] duration-300 ${
          turkey.hit
            ? "opacity-70 scale-90"
            : "hover:scale-110 hover:brightness-110"
        }`}
        style={{
          left: 0,
          top: 0,
          willChange: 'transform',
          filter: colorFilter,
          transform: `translate(${turkey.x}px, ${turkey.y}px) scaleX(${shouldFlip ? -1 : 1})`,
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
            left: 0,
            top: 0,
            transform: `translate(${turkey.x + 20}px, ${turkey.y - 10}px)`,
          }}
        >
          +{turkey.type === 'green' ? 50 : turkey.type === 'yellow' ? 20 : 10}
        </div>
      )}

      {turkey.hit && (
        <div
          className="absolute pointer-events-none animate-score-popup"
          style={{
            left: 0,
            top: 0,
            transform: `translate(${turkey.x + 15}px, ${turkey.y + 10}px)`,
          }}
        >
          <span className="text-2xl">💥</span>
        </div>
      )}
    </>
  );
};
