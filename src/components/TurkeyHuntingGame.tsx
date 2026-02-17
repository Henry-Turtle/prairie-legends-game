import { useState, useEffect, useCallback, useRef } from "react";
import { Turkey } from "./Turkey";
import { GameUI } from "./GameUI";
import { GameOverScreen } from "./GameOverScreen";
import { SimpleBackground } from "./SimpleBackground";
import { EmailOptIn } from "./EmailOptIn";
import { Button } from "./ui/button";
import { AnimationFrameProvider } from "./AnimationFrameContext";

export interface TurkeyType {
  id: number;
  x: number;
  y: number;
  speed: number;
  direction: 'left' | 'right' | 'up' | 'down' | 'diagonal-up' | 'diagonal-down';
  hit: boolean;
  hitTime?: number; // timestamp when hit, for animation delay
  type: 'normal' | 'yellow' | 'green';
  sinWaveOffset?: number; // Phase offset for green turkeys
  sinTravelDist?: number; // Accumulated travel distance for sine wave
  sineBasePerp?: number; // Base perpendicular position (y for left/right, x for up/down)
}

export const TurkeyHuntingGame = () => {
  const [gameState, setGameState] = useState<"emailOptIn" | "menu" | "playing" | "gameOver">("emailOptIn");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [shootAnimation, setShootAnimation] = useState(false);
  const [renderTick, setRenderTick] = useState(0);

  const turkeysRef = useRef<TurkeyType[]>([]);
  const nextIdRef = useRef(0);
  const timeLeftRef = useRef(timeLeft);
  const animFrameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const shootTimeoutRef = useRef<number | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);

  // Clean up shoot timeout on unmount
  useEffect(() => {
    return () => {
      if (shootTimeoutRef.current !== null) {
        clearTimeout(shootTimeoutRef.current);
      }
    };
  }, []);

  // Spawn turkeys based on time remaining - increases as game progresses
  useEffect(() => {
    if (gameState !== "playing") return;

    let cancelled = false;
    const timeoutIds: number[] = [];
    const activeSpawners = new Map<string, boolean>();

    const createTurkey = (type: 'normal' | 'yellow' | 'green') => {
      const directions = ['left', 'right', 'up', 'down', 'diagonal-up', 'diagonal-down'] as const;
      const direction = directions[Math.floor(Math.random() * directions.length)];

      const container = gameContainerRef.current;
      const screenWidth = container ? container.clientWidth : window.innerWidth;
      const screenHeight = container ? container.clientHeight : window.innerHeight;
      let x: number, y: number;

      // Spawn from different edges based on direction
      switch (direction) {
        case 'left':
          x = screenWidth + 100;
          y = Math.random() * (screenHeight - 200) + 100;
          break;
        case 'right':
          x = -100;
          y = Math.random() * (screenHeight - 200) + 100;
          break;
        case 'up':
          x = Math.random() * (screenWidth - 200) + 100;
          y = screenHeight + 100;
          break;
        case 'down':
          x = Math.random() * (screenWidth - 200) + 100;
          y = -100;
          break;
        case 'diagonal-up':
          x = Math.random() < 0.5 ? -100 : screenWidth + 100;
          y = screenHeight + 100;
          break;
        case 'diagonal-down':
          x = Math.random() < 0.5 ? -100 : screenWidth + 100;
          y = -100;
          break;
      }

      // Speed based on type
      let speed: number;
      if (type === 'yellow') {
        speed = Math.random() * 1 + 2.5; // Super fast: 2.5-3.5
      } else if (type === 'green') {
        speed = Math.random() * 0.8 + 2.5; // Fast: 2.5-3.3
      } else {
        speed = Math.random() * 1.5 + 0.8; // Normal: 0.8-2.3
      }

      const newTurkey: TurkeyType = {
        id: nextIdRef.current++,
        x: x!,
        y: y!,
        speed,
        direction,
        hit: false,
        type,
        sinWaveOffset: type === 'green' ? Math.random() * Math.PI * 2 : undefined,
        sinTravelDist: type === 'green' ? 0 : undefined,
        sineBasePerp: undefined, // set on first movement frame
      };

      turkeysRef.current.push(newTurkey);
      setRenderTick(t => t + 1);
    };

    const scheduleSpawns = (turkeyType: 'normal' | 'yellow' | 'green', perSecond: number) => {
      if (activeSpawners.has(turkeyType)) return;
      activeSpawners.set(turkeyType, true);

      const delay = 1000 / perSecond;

      const spawn = () => {
        if (cancelled) return;
        createTurkey(turkeyType);
        const id = window.setTimeout(spawn, delay);
        timeoutIds.push(id);
      };

      spawn(); // Start immediately
    };

    // Check time and adjust spawners
    const checkAndAdjust = () => {
      if (cancelled) return;

      const tl = timeLeftRef.current;

      if (tl > 40) {
        // First 20 seconds: Normal at 1/sec
        scheduleSpawns('normal', 1);
      } else if (tl > 20) {
        // Next 20 seconds: Normal at 1/sec + Yellow at 0.5/sec
        scheduleSpawns('normal', 1);
        scheduleSpawns('yellow', 0.5);
      } else if (tl > 0) {
        // Last 20 seconds: restart with new rates
        activeSpawners.clear();
        timeoutIds.forEach(id => clearTimeout(id));
        timeoutIds.length = 0;

        scheduleSpawns('normal', 2);
        scheduleSpawns('yellow', 0.5);
        scheduleSpawns('green', 0.5);
      }

      if (!cancelled) {
        const id = window.setTimeout(checkAndAdjust, 1000);
        timeoutIds.push(id);
      }
    };

    checkAndAdjust();

    return () => {
      cancelled = true;
      timeoutIds.forEach(id => clearTimeout(id));
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

  // Move turkeys via requestAnimationFrame with delta time
  useEffect(() => {
    if (gameState !== "playing") return;

    const buffer = 150;
    lastTimeRef.current = 0;

    const tick = (timestamp: number) => {
      // Read actual container dimensions every frame to handle zoom/resize/scaling
      const container = gameContainerRef.current;
      const screenWidth = container ? container.clientWidth : window.innerWidth;
      const screenHeight = container ? container.clientHeight : window.innerHeight;
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const elapsed = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      // Normalize to 30fps baseline, cap to prevent jumps on frame spikes
      const dt = Math.min(elapsed / 33.33, 3);
      if (dt > 2) console.log(`[FRAME-SPIKE] dt=${dt.toFixed(2)} elapsed=${elapsed.toFixed(0)}ms`);
      frameCountRef.current += dt;

      const arr = turkeysRef.current;
      let writeIdx = 0;
      const now = timestamp;

      for (let i = 0; i < arr.length; i++) {
        const turkey = arr[i];

        // Keep hit turkeys for 800ms so animation can play, then remove
        if (turkey.hit) {
          if (turkey.hitTime && (now - turkey.hitTime) < 800) {
            arr[writeIdx++] = turkey;
          } else {
            console.log(`[DESPAWN:hit-timeout] id=${turkey.id} type=${turkey.type} pos=(${turkey.x.toFixed(0)},${turkey.y.toFixed(0)}) hitTime=${turkey.hitTime} now=${now.toFixed(0)} elapsed=${turkey.hitTime ? (now - turkey.hitTime).toFixed(0) : 'N/A'}`);
          }
          continue;
        }

        const speedX = turkey.speed * 2 * dt;
        const speedDiag = turkey.speed * 1.5 * dt;

        // Calculate new position based on direction
        switch (turkey.direction) {
          case 'left':
            turkey.x -= speedX;
            break;
          case 'right':
            turkey.x += speedX;
            break;
          case 'up':
            turkey.y -= speedX;
            break;
          case 'down':
            turkey.y += speedX;
            break;
          case 'diagonal-up':
            turkey.x += turkey.x < screenWidth / 2 ? speedDiag : -speedDiag;
            turkey.y -= speedDiag;
            break;
          case 'diagonal-down':
            turkey.x += turkey.x < screenWidth / 2 ? speedDiag : -speedDiag;
            turkey.y += speedDiag;
            break;
        }

        // Bounds check BEFORE sine wave (use linear path for removal)
        if (turkey.x < -buffer || turkey.x > screenWidth + buffer ||
            turkey.y < -buffer || turkey.y > screenHeight + buffer) {
          console.log(`[DESPAWN:bounds] id=${turkey.id} type=${turkey.type} dir=${turkey.direction} pos=(${turkey.x.toFixed(0)},${turkey.y.toFixed(0)}) screen=(${screenWidth},${screenHeight}) dt=${dt.toFixed(2)} speed=${turkey.speed.toFixed(2)}`);
          continue; // off-screen, remove
        }

        // Green turkey sine wave: oscillate perpendicular to movement
        if (turkey.type === 'green' && turkey.sinTravelDist !== undefined) {
          const amplitude = 175;
          const frequency = 0.035;
          turkey.sinTravelDist! += turkey.speed * dt;
          const sineOffset = Math.sin(turkey.sinTravelDist! * frequency + turkey.sinWaveOffset!) * amplitude;

          const dir = turkey.direction;
          if (dir === 'left' || dir === 'right') {
            if (turkey.sineBasePerp === undefined) turkey.sineBasePerp = turkey.y;
            turkey.y = turkey.sineBasePerp + sineOffset;
          } else if (dir === 'up' || dir === 'down') {
            if (turkey.sineBasePerp === undefined) turkey.sineBasePerp = turkey.x;
            turkey.x = turkey.sineBasePerp + sineOffset;
          } else {
            if (turkey.sineBasePerp === undefined) turkey.sineBasePerp = turkey.y;
            turkey.y = turkey.sineBasePerp + sineOffset;
          }
        }

        arr[writeIdx++] = turkey;
      }

      arr.length = writeIdx;
      setRenderTick(t => t + 1);

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [gameState]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setTimeLeft(60);
    turkeysRef.current = [];
    nextIdRef.current = 0;
    frameCountRef.current = 0;
    lastTimeRef.current = 0;
  };

  const handleTurkeyHit = useCallback((turkeyId: number) => {
    const t = turkeysRef.current.find(t => t.id === turkeyId);
    if (t && !t.hit) {
      t.hit = true;
      t.hitTime = performance.now();
      const points = t.type === 'green' ? 50 : t.type === 'yellow' ? 20 : 10;
      setScore(prev => prev + points);
      triggerShootAnimation();
    }
  }, []);

  const triggerShootAnimation = useCallback(() => {
    setShootAnimation(true);
    if (shootTimeoutRef.current !== null) {
      clearTimeout(shootTimeoutRef.current);
    }
    shootTimeoutRef.current = window.setTimeout(() => {
      setShootAnimation(false);
      shootTimeoutRef.current = null;
    }, 1000);
  }, []);

  const handleGameClick = (event: React.MouseEvent) => {
    if (gameState !== "playing") return;
    console.log(`[CLICK] pos=(${event.clientX},${event.clientY}) screen=(${window.innerWidth},${window.innerHeight})`);
    triggerShootAnimation();
  };

  const handleEmailOptInComplete = () => {
    setGameState("menu");
  };

  const handleReset = () => {
    setGameState("emailOptIn");
    setScore(0);
    setTimeLeft(60);
    turkeysRef.current = [];
    nextIdRef.current = 0;
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
    <AnimationFrameProvider>
      <div
        ref={gameContainerRef}
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

        {turkeysRef.current.map(turkey => (
          <Turkey
            key={turkey.id}
            turkey={turkey}
            onHit={handleTurkeyHit}
          />
        ))}

        {/* Simple forest ground */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-forest-deep to-forest-dark pointer-events-none opacity-80" />
      </div>
    </AnimationFrameProvider>
  );
};
