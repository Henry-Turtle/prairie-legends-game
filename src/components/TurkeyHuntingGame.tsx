import { useState, useEffect, useCallback } from "react";
import { Turkey } from "./Turkey";
import { GameUI } from "./GameUI";
import { GameOverScreen } from "./GameOverScreen";
import { BackgroundElements } from "./BackgroundElements";
import { EnhancedBackground } from "./EnhancedBackground";
import { ParticleSystem, createExplosionParticles, createMuzzleFlash } from "./ParticleSystem";
import { Button } from "./ui/button";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: "feather" | "spark" | "blood" | "muzzle";
}

export interface TurkeyType {
  id: number;
  x: number;
  y: number;
  speed: number;
  hit: boolean;
}

export const TurkeyHuntingGame = () => {
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">("menu");
  const [turkeys, setTurkeys] = useState<TurkeyType[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [turkeyIdCounter, setTurkeyIdCounter] = useState(0);
  const [shootAnimation, setShootAnimation] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [particleIdCounter, setParticleIdCounter] = useState(0);

  // Spawn turkeys at random intervals
  useEffect(() => {
    if (gameState !== "playing") return;

    const spawnInterval = setInterval(() => {
      const newTurkey: TurkeyType = {
        id: turkeyIdCounter,
        x: -100,
        y: Math.random() * 300 + 100, // Random height between 100-400px from top
        speed: Math.random() * 2 + 1, // Random speed between 1-3
        hit: false,
      };
      setTurkeys(prev => [...prev, newTurkey]);
      setTurkeyIdCounter(prev => prev + 1);
    }, Math.random() * 2000 + 1000); // Spawn every 1-3 seconds

    return () => clearInterval(spawnInterval);
  }, [gameState, turkeyIdCounter]);

  // Game timer
  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState("gameOver");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Move turkeys and remove off-screen ones
  useEffect(() => {
    if (gameState !== "playing") return;

    const moveInterval = setInterval(() => {
      setTurkeys(prev => 
        prev
          .map(turkey => ({ ...turkey, x: turkey.x + turkey.speed * 2 }))
          .filter(turkey => turkey.x < window.innerWidth + 100 && !turkey.hit)
      );
    }, 16); // ~60fps

    return () => clearInterval(moveInterval);
  }, [gameState]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setTimeLeft(60);
    setTurkeys([]);
    setTurkeyIdCounter(0);
    setParticles([]);
    setParticleIdCounter(0);
  };

  const handleTurkeyHit = useCallback((turkeyId: number) => {
    const hitTurkey = turkeys.find(t => t.id === turkeyId);
    if (!hitTurkey) return;

    // Create explosion particles
    const explosionParticles = createExplosionParticles(
      hitTurkey.x + 25, 
      hitTurkey.y + 25, 
      particleIdCounter
    );
    setParticles(prev => [...prev, ...explosionParticles]);
    setParticleIdCounter(prev => prev + 1);

    // Screen shake effect
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 300);

    setTurkeys(prev => 
      prev.map(turkey => 
        turkey.id === turkeyId ? { ...turkey, hit: true } : turkey
      )
    );
    setScore(prev => prev + 10);
    setShootAnimation(true);
    setTimeout(() => setShootAnimation(false), 150);
  }, [turkeys, particleIdCounter]);

  const handleGameClick = (event: React.MouseEvent) => {
    if (gameState !== "playing") return;
    
    // Create muzzle flash effect
    const muzzleParticles = createMuzzleFlash(
      event.clientX - 20,
      event.clientY - 20,
      particleIdCounter
    );
    setParticles(prev => [...prev, ...muzzleParticles]);
    setParticleIdCounter(prev => prev + 1);
    
    setShootAnimation(true);
    setTimeout(() => setShootAnimation(false), 150);
  };

  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-gradient-sky relative overflow-hidden">
        <EnhancedBackground />
        <BackgroundElements />
        
        {/* Custom cursor */}
        <div className="cursor-crosshair" />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center backdrop-blur-lg bg-gradient-card rounded-3xl p-16 shadow-glow border border-autumn-gold/20 animate-fade-in">
            <h1 className="text-9xl font-bold bg-gradient-autumn bg-clip-text text-transparent mb-8 drop-shadow-glow animate-crosshair-pulse">
              🦃 Turkey Hunt
            </h1>
            <p className="text-2xl text-foreground/90 mb-12 font-medium tracking-wide">
              Test your aim as turkeys soar across the autumn sky!
            </p>
            <Button 
              onClick={startGame}
              size="lg"
              className="bg-gradient-autumn text-white font-bold text-xl px-16 py-8 hover:scale-110 transition-all duration-300 shadow-glow border-0 rounded-xl hover:shadow-[0_0_40px_hsl(var(--autumn-gold)_/_0.6)]"
            >
              🏹 Start Hunting
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "gameOver") {
    return <GameOverScreen score={score} onRestart={startGame} />;
  }

  return (
    <div 
      className={`min-h-screen bg-gradient-sky overflow-hidden relative transition-all duration-150 ${
        shootAnimation ? "animate-crosshair-shoot" : ""
      } ${screenShake ? "animate-screen-shake" : ""}`}
      onClick={handleGameClick}
      style={{ 
        cursor: `url("data:image/svg+xml,%3csvg width='32' height='32' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='16' cy='16' r='2' fill='%23fbbf24'/%3e%3cline x1='16' y1='4' x2='16' y2='12' stroke='%23fbbf24' stroke-width='2'/%3e%3cline x1='16' y1='20' x2='16' y2='28' stroke='%23fbbf24' stroke-width='2'/%3e%3cline x1='4' y1='16' x2='12' y2='16' stroke='%23fbbf24' stroke-width='2'/%3e%3cline x1='20' y1='16' x2='28' y2='16' stroke='%23fbbf24' stroke-width='2'/%3e%3c/svg%3e") 16 16, crosshair`
      }}
    >
      <EnhancedBackground />
      <BackgroundElements />
      
      <GameUI score={score} timeLeft={timeLeft} />
      
      <ParticleSystem 
        particles={particles} 
        onParticleUpdate={setParticles} 
      />
      
      {turkeys.map(turkey => (
        <Turkey
          key={turkey.id}
          turkey={turkey}
          onHit={handleTurkeyHit}
        />
      ))}
      
      {/* Enhanced Forest Silhouette with depth */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-forest pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-forest-deep via-forest-dark/90 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-forest-deep to-forest-dark/70 pointer-events-none" />
      
      {/* Atmospheric overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-forest-deep/20 pointer-events-none" />
    </div>
  );
};