import { useEffect, useState } from "react";

interface Mountain {
  id: number;
  height: number;
  width: number;
  x: number;
  opacity: number;
}

interface Tree {
  id: number;
  x: number;
  height: number;
  type: number;
}

export const EnhancedBackground = () => {
  const [mountains, setMountains] = useState<Mountain[]>([]);
  const [trees, setTrees] = useState<Tree[]>([]);

  useEffect(() => {
    // Generate mountain layers
    const mountainLayers: Mountain[] = [];
    for (let layer = 0; layer < 4; layer++) {
      for (let i = 0; i < 6; i++) {
        mountainLayers.push({
          id: layer * 10 + i,
          height: 200 + Math.random() * 150 - layer * 30,
          width: 150 + Math.random() * 200,
          x: (i * window.innerWidth) / 5 + Math.random() * 100 - 50,
          opacity: 0.15 + layer * 0.05,
        });
      }
    }
    setMountains(mountainLayers);

    // Generate trees for foreground
    const treeArray: Tree[] = [];
    for (let i = 0; i < 20; i++) {
      treeArray.push({
        id: i,
        x: (i * window.innerWidth) / 19 + Math.random() * 50,
        height: 80 + Math.random() * 60,
        type: Math.floor(Math.random() * 3),
      });
    }
    setTrees(treeArray);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Atmospheric gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-dawn/30 via-sky-dusk/20 to-forest-light/40" />
      
      {/* Mountain layers */}
      {mountains.map((mountain) => (
        <div
          key={`mountain-${mountain.id}`}
          className="absolute bottom-40"
          style={{
            left: `${mountain.x}px`,
            width: `${mountain.width}px`,
            height: `${mountain.height}px`,
            backgroundColor: `hsl(140, 30%, ${15 - mountain.opacity * 20}%)`,
            opacity: mountain.opacity,
            clipPath: `polygon(0% 100%, ${Math.random() * 20}% ${80 + Math.random() * 20}%, ${20 + Math.random() * 20}% ${60 + Math.random() * 30}%, ${40 + Math.random() * 20}% ${40 + Math.random() * 40}%, ${60 + Math.random() * 20}% ${30 + Math.random() * 50}%, ${80 + Math.random() * 20}% ${70 + Math.random() * 20}%, 100% 100%)`,
          }}
        />
      ))}

      {/* Atmospheric fog */}
      <div className="absolute bottom-32 left-0 right-0 h-32 bg-gradient-to-t from-sky-dusk/20 to-transparent" />
      
      {/* Enhanced light rays */}
      <div className="absolute top-0 left-1/6 w-2 h-full bg-gradient-to-b from-sky-dawn/30 to-transparent transform -skew-x-12 animate-pulse blur-sm" 
           style={{ animationDuration: "6s" }} />
      <div className="absolute top-0 left-1/3 w-1 h-full bg-gradient-to-b from-autumn-gold/25 to-transparent transform -skew-x-6 animate-pulse blur-sm" 
           style={{ animationDuration: "8s", animationDelay: "2s" }} />
      <div className="absolute top-0 right-1/4 w-2 h-full bg-gradient-to-b from-sky-dawn/20 to-transparent transform skew-x-8 animate-pulse blur-sm" 
           style={{ animationDuration: "7s", animationDelay: "4s" }} />

      {/* Volumetric lighting effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-sky-dawn/5 to-transparent" 
           style={{
             background: `radial-gradient(ellipse at 30% 20%, hsl(var(--sky-dawn) / 0.1) 0%, transparent 50%), 
                         radial-gradient(ellipse at 70% 30%, hsl(var(--autumn-gold) / 0.08) 0%, transparent 40%)`
           }} />

      {/* Foreground trees silhouettes */}
      <div className="absolute bottom-0 left-0 right-0 h-48">
        {trees.map((tree) => (
          <div
            key={`tree-${tree.id}`}
            className="absolute bottom-0 opacity-60"
            style={{
              left: `${tree.x}px`,
              height: `${tree.height}px`,
              width: `${tree.height * 0.6}px`,
              background: `linear-gradient(to top, hsl(var(--forest-deep)), hsl(var(--forest-dark)))`,
              clipPath: tree.type === 0 
                ? 'polygon(50% 0%, 20% 100%, 80% 100%)' 
                : tree.type === 1
                ? 'polygon(50% 0%, 30% 30%, 10% 100%, 90% 100%, 70% 30%)'
                : 'polygon(50% 0%, 40% 20%, 25% 40%, 15% 100%, 85% 100%, 75% 40%, 60% 20%)',
            }}
          />
        ))}
      </div>

      {/* Depth fog overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-forest-deep/60 via-forest-dark/30 to-transparent" />
    </div>
  );
};