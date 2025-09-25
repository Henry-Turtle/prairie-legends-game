import { useEffect, useState } from "react";

interface Leaf {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  type: "🍂" | "🍃";
}

interface Cloud {
  id: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
}

export const BackgroundElements = () => {
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const [clouds, setClouds] = useState<Cloud[]>([]);

  useEffect(() => {
    // Generate leaves
    const leafArray: Leaf[] = [];
    for (let i = 0; i < 12; i++) {
      leafArray.push({
        id: i,
        x: Math.random() * window.innerWidth,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 4,
        size: 0.8 + Math.random() * 0.6,
        type: Math.random() > 0.5 ? "🍂" : "🍃",
      });
    }
    setLeaves(leafArray);

    // Generate clouds
    const cloudArray: Cloud[] = [];
    for (let i = 0; i < 4; i++) {
      cloudArray.push({
        id: i,
        y: 50 + Math.random() * 200,
        delay: Math.random() * 15,
        duration: 25 + Math.random() * 10,
        size: 0.7 + Math.random() * 0.8,
      });
    }
    setClouds(cloudArray);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Leaves */}
      {leaves.map((leaf) => (
        <div
          key={`leaf-${leaf.id}`}
          className="absolute text-2xl animate-leaf-fall"
          style={{
            left: `${leaf.x}px`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
            transform: `scale(${leaf.size})`,
          }}
        >
          {leaf.type}
        </div>
      ))}

      {/* Animated Clouds */}
      {clouds.map((cloud) => (
        <div
          key={`cloud-${cloud.id}`}
          className="absolute opacity-20 animate-cloud-drift"
          style={{
            top: `${cloud.y}px`,
            animationDelay: `${cloud.delay}s`,
            animationDuration: `${cloud.duration}s`,
            transform: `scale(${cloud.size})`,
          }}
        >
          <div className="text-6xl filter blur-sm">☁️</div>
        </div>
      ))}

      {/* Atmospheric Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-forest-deep/10" />
      
      {/* Light Rays */}
      <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-sky-dawn/20 to-transparent transform -skew-x-12 animate-pulse" 
           style={{ animationDuration: "4s" }} />
      <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-sky-dawn/15 to-transparent transform skew-x-12 animate-pulse" 
           style={{ animationDuration: "6s", animationDelay: "2s" }} />
    </div>
  );
};