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
  type: 'normal' | 'yellow' | 'green';
  sinWaveOffset?: number; // For green turkeys
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
    const timeoutIds: number[] = [];

    const createTurkey = (type: 'normal' | 'yellow' | 'green') => {
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

      // Speed based on type
      let speed: number;
      if (type === 'yellow') {
        speed = Math.random() * 1 + 2.5; // Super fast: 2.5-3.5
      } else if (type === 'green') {
        speed = Math.random() * 0.5 + 2; // Fast: 2-2.5
      } else {
        speed = Math.random() * 1.5 + 0.8; // Normal: 0.8-2.3
      }

      const newTurkey: TurkeyType = {
        id: Date.now() + Math.random(),
        x,
        y,
        speed,
        direction,
        hit: false,
        type,
        sinWaveOffset: type === 'green' ? Math.random() * Math.PI * 2 : undefined,
      };
      
      console.log('Spawning turkey:', newTurkey);
      setTurkeys(prev => [...prev, newTurkey]);
    };

    const scheduleSpawns = (turkeyType: 'normal' | 'yellow' | 'green', perSecond: number) => {
      const delay = 1000 / perSecond;
      
      const spawn = () => {
        if (cancelled) return;
        createTurkey(turkeyType);
        const id = window.setTimeout(spawn, delay);
        timeoutIds.push(id);
      };
      
      const id = window.setTimeout(spawn, delay);
      timeoutIds.push(id);
    };

    // Determine spawn rates based on time remaining
    const tl = timeLeftRef.current;
    
    if (tl > 40) {
      // First 20 seconds: Normal at 1/sec
      scheduleSpawns('normal', 1);
    } else if (tl > 20) {
      // Next 20 seconds: Normal at 1/sec + Yellow at 0.5/sec
      scheduleSpawns('normal', 1);
      scheduleSpawns('yellow', 0.5);
    } else {
      // Last 20 seconds: Normal at 2/sec + Yellow at 0.5/sec + Green at 0.5/sec
      scheduleSpawns('normal', 2);
      scheduleSpawns('yellow', 0.5);
      scheduleSpawns('green', 0.5);
    }

    return () => {
      cancelled = true;
      timeoutIds.forEach(id => clearTimeout(id));
    };
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

    // Cache window dimensions to avoid repeated property access
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const buffer = 150;
    let frameCount = 0;

    const moveInterval = setInterval(() => {
      frameCount++;
      
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
          
          // Green turkey sin wave movement
          if (turkey.type === 'green' && turkey.sinWaveOffset !== undefined) {
            const amplitude = 50; // Height of sin wave
            const frequency = 0.05; // How tight the wave is
            newY += Math.sin((frameCount * frequency) + turkey.sinWaveOffset) * amplitude * 0.1;
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