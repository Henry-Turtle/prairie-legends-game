import { useState, useEffect, useCallback } from "react";
import { Turkey } from "./Turkey";
import { GameUI } from "./GameUI";
import { GameOverScreen } from "./GameOverScreen";
import { SimpleBackground } from "./SimpleBackground";
import { EmailOptIn } from "./EmailOptIn";
import { Button } from "./ui/button";

export interface TurkeyType {
  id: number;
  x: number;
  y: number;
  speed: number;
  hit: boolean;
}

export const TurkeyHuntingGame = () => {
  const [gameState, setGameState] = useState<"emailOptIn" | "menu" | "playing" | "gameOver">("emailOptIn");
  const [turkeys, setTurkeys] = useState<TurkeyType[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [turkeyIdCounter, setTurkeyIdCounter] = useState(0);
  const [shootAnimation, setShootAnimation] = useState(false);

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
  };

  const handleTurkeyHit = useCallback((turkeyId: number) => {
    setTurkeys(prev => 
      prev.map(turkey => 
        turkey.id === turkeyId ? { ...turkey, hit: true } : turkey
      )
    );
    setScore(prev => prev + 10);
    setShootAnimation(true);
    setTimeout(() => setShootAnimation(false), 200);
  }, []);

  const handleGameClick = (event: React.MouseEvent) => {
    if (gameState !== "playing") return;
    
    setShootAnimation(true);
    setTimeout(() => setShootAnimation(false), 200);
  };

  const handleEmailOptInComplete = () => {
    setGameState("menu");
  };

  if (gameState === "emailOptIn") {
    return <EmailOptIn onComplete={handleEmailOptInComplete} />;
  }

  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-gradient-sky relative overflow-hidden">
        <SimpleBackground />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center backdrop-blur-sm bg-gradient-card rounded-2xl p-12 shadow-soft border border-autumn-gold/30">
            <h1 className="text-7xl font-bold bg-gradient-autumn bg-clip-text text-transparent mb-6">
              🦃 Turkey Hunt
            </h1>
            <p className="text-xl text-foreground/90 mb-8 font-medium">
              Test your aim as turkeys run across the autumn landscape!
            </p>
            <Button 
              onClick={startGame}
              size="lg"
              className="bg-gradient-autumn text-white font-bold text-lg px-10 py-4 hover:scale-105 transition-all duration-200 shadow-soft border-0 rounded-xl"
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
      className={`min-h-screen bg-gradient-sky overflow-hidden relative ${
        shootAnimation ? "animate-crosshair-shoot" : ""
      }`}
      onClick={handleGameClick}
      style={{ cursor: "crosshair" }}
    >
      <SimpleBackground />
      
      <GameUI score={score} timeLeft={timeLeft} />
      
      {turkeys.map(turkey => (
        <Turkey
          key={turkey.id}
          turkey={turkey}
          onHit={handleTurkeyHit}
        />
      ))}
      
      {/* Simple forest ground */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-forest-deep to-forest-dark pointer-events-none opacity-80" />
    </div>
  );
};