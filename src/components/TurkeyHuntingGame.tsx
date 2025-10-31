import { useState, useEffect, useCallback, useRef } from "react";
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

  const timeLeftRef = useRef(timeLeft);
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);

  // Spawn turkeys based on time remaining - increases as game progresses
  useEffect(() => {
    if (gameState !== "playing") return;

    let cancelled = false;
    let timeoutId: number | undefined;

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

      const newTurkey = {
        id: Date.now() + Math.random(), // Unique ID
        x,
        y,
        speed: Math.random() * 1.5 + 0.8,
        direction,
        hit: false,
      };
      
      console.log('Spawning turkey:', newTurkey);
      setTurkeys(prev => [...prev, newTurkey]);
    };

    const scheduleNext = () => {
      if (cancelled) return;

      // Determine turkeys per second based on current time remaining
      const tl = timeLeftRef.current;
      let turkeysPerSecond = 0.5;
      if (tl > 50) turkeysPerSecond = 0.5;    // First 10s: 0.5 per second
      else if (tl > 40) turkeysPerSecond = 1; // Next 10s: 1 per second
      else if (tl > 30) turkeysPerSecond = 1.5; // Next 10s: 1.5 per second
      else turkeysPerSecond = 3;                    // Final 30s: 3 per second

      const delay = 1000 / turkeysPerSecond;

      timeoutId = window.setTimeout(() => {
        if (cancelled) return;
        createTurkey();
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [gameState]);


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

    // Cache window dimensions to avoid repeated property access
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const buffer = 150; // Buffer to accommodate spawn at 100px and ensure prompt despawn

    const moveInterval = setInterval(() => {
      setTurkeys(prev => {
        const updated: TurkeyType[] = [];
        
        for (let i = 0; i < prev.length; i++) {
          const turkey = prev[i];
          
          // Skip hit turkeys - they'll be removed
          if (turkey.hit) continue;
          
          let newX = turkey.x;
          let newY = turkey.y;
          const speedX = turkey.speed * 2;
          const speedDiag = turkey.speed * 1.5;
          
          // Calculate new position based on direction
          switch (turkey.direction) {
            case 'left':
              newX -= speedX;
              break;
            case 'right':
              newX += speedX;
              break;
            case 'up':
              newY -= speedX;
              break;
            case 'down':
              newY += speedX;
              break;
            case 'diagonal-up':
              newX += turkey.x < screenWidth / 2 ? speedDiag : -speedDiag;
              newY -= speedDiag;
              break;
            case 'diagonal-down':
              newX += turkey.x < screenWidth / 2 ? speedDiag : -speedDiag;
              newY += speedDiag;
              break;
          }
          
          // Only keep if still on screen (with buffer for spawn positions)
          if (newX > -buffer && newX < screenWidth + buffer && 
              newY > -buffer && newY < screenHeight + buffer) {
            updated.push({ ...turkey, x: newX, y: newY });
          } else {
            console.log('Despawning turkey:', turkey.id, 'at', newX, newY);
          }
        }
        
        return updated;
      });
    }, 33); // 30fps for better performance

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