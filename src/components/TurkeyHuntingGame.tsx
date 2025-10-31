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
  direction: 'left' | 'right' | 'up' | 'down' | 'diagonal-up' | 'diagonal-down';
  hit: boolean;
}

export const TurkeyHuntingGame = () => {
  const [gameState, setGameState] = useState<"emailOptIn" | "menu" | "playing" | "gameOver">("emailOptIn");
  const [turkeys, setTurkeys] = useState<TurkeyType[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [turkeyIdCounter, setTurkeyIdCounter] = useState(0);
  const [shootAnimation, setShootAnimation] = useState(false);

  // Spawn turkeys based on time remaining - increases as game progresses
  useEffect(() => {
    if (gameState !== "playing") return;

    // Determine turkeys per second based on time remaining
    let turkeysPerSecond = 0.5;
    if (timeLeft > 50) turkeysPerSecond = 0.5;    // First 10s: 0.5 per second
    else if (timeLeft > 40) turkeysPerSecond = 1; // Next 10s: 1 per second
    else if (timeLeft > 30) turkeysPerSecond = 1.5; // Next 10s: 1.5 per second
    else turkeysPerSecond = 3;                    // Final 30s: 3 per second

    const spawnInterval = 1000 / turkeysPerSecond;

    const createTurkey = () => {
      const directions = ['left', 'right', 'up', 'down', 'diagonal-up', 'diagonal-down'] as const;
      const direction = directions[Math.floor(Math.random() * directions.length)];
      
      let x, y;
      
      // Spawn from different edges based on direction
      switch (direction) {
        case 'left':
          x = window.innerWidth + 100;
          y = Math.random() * (window.innerHeight - 200) + 100;
          break;
        case 'right':
          x = -100;
          y = Math.random() * (window.innerHeight - 200) + 100;
          break;
        case 'up':
          x = Math.random() * (window.innerWidth - 200) + 100;
          y = window.innerHeight + 100;
          break;
        case 'down':
          x = Math.random() * (window.innerWidth - 200) + 100;
          y = -100;
          break;
        case 'diagonal-up':
          x = Math.random() < 0.5 ? -100 : window.innerWidth + 100;
          y = window.innerHeight + 100;
          break;
        case 'diagonal-down':
          x = Math.random() < 0.5 ? -100 : window.innerWidth + 100;
          y = -100;
          break;
      }

      setTurkeys(prev => [...prev, {
        id: Date.now() + Math.random(), // Unique ID
        x,
        y,
        speed: Math.random() * 1.5 + 0.8,
        direction,
        hit: false,
      }]);
    };

    const spawnTimer = setInterval(createTurkey, spawnInterval);

    return () => clearInterval(spawnTimer);
  }, [gameState, timeLeft]);

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

  // Move turkeys and remove off-screen ones - optimized for performance
  useEffect(() => {
    if (gameState !== "playing") return;

    const moveInterval = setInterval(() => {
      setTurkeys(prev => {
        return prev
          .map(turkey => {
            // Skip movement calculations for hit turkeys (they'll be removed)
            if (turkey.hit) return turkey;
            
            let newX = turkey.x;
            let newY = turkey.y;
            
            switch (turkey.direction) {
              case 'left':
                newX = turkey.x - turkey.speed * 2;
                break;
              case 'right':
                newX = turkey.x + turkey.speed * 2;
                break;
              case 'up':
                newY = turkey.y - turkey.speed * 2;
                break;
              case 'down':
                newY = turkey.y + turkey.speed * 2;
                break;
              case 'diagonal-up':
                newX = turkey.x < window.innerWidth / 2 ? turkey.x + turkey.speed * 1.5 : turkey.x - turkey.speed * 1.5;
                newY = turkey.y - turkey.speed * 1.5;
                break;
              case 'diagonal-down':
                newX = turkey.x < window.innerWidth / 2 ? turkey.x + turkey.speed * 1.5 : turkey.x - turkey.speed * 1.5;
                newY = turkey.y + turkey.speed * 1.5;
                break;
            }
            
            return { ...turkey, x: newX, y: newY };
          })
          .filter(turkey => {
            // Remove hit turkeys immediately
            if (turkey.hit) return false;
            
            // Remove turkeys that are off-screen (with smaller buffer)
            if (turkey.x < -150 || turkey.x > window.innerWidth + 150 || 
                turkey.y < -150 || turkey.y > window.innerHeight + 150) {
              return false;
            }
            
            return true;
          });
      });
    }, 20); // Slightly lower frame rate (50fps) for better performance

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
    setTimeout(() => setShootAnimation(false), 1000);
  }, []);

  const handleGameClick = (event: React.MouseEvent) => {
    if (gameState !== "playing") return;
    
    setShootAnimation(true);
    setTimeout(() => setShootAnimation(false), 1000);
  };

  const handleEmailOptInComplete = () => {
    setGameState("menu");
  };

  const handleReset = () => {
    setGameState("emailOptIn");
    setScore(0);
    setTimeLeft(60);
    setTurkeys([]);
    setTurkeyIdCounter(0);
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
      className="min-h-screen bg-gradient-sky overflow-hidden relative"
      onClick={handleGameClick}
      style={{ cursor: "crosshair" }}
    >
      {shootAnimation && (
        <div className="fixed inset-0 pointer-events-none z-50 animate-crosshair-shoot" 
             style={{ mixBlendMode: "color-dodge" }} />
      )}
      <SimpleBackground />
      
      <GameUI score={score} timeLeft={timeLeft} onReset={handleReset} />
      
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