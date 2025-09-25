import { useEffect, useState } from "react";

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

interface ParticleSystemProps {
  particles: Particle[];
  onParticleUpdate: (particles: Particle[]) => void;
}

export const ParticleSystem = ({ particles, onParticleUpdate }: ParticleSystemProps) => {
  useEffect(() => {
    if (particles.length === 0) return;

    const animate = () => {
      const updatedParticles = particles
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.3, // gravity
          vx: particle.vx * 0.98, // air resistance
          life: particle.life - 1,
          size: particle.size * 0.99,
        }))
        .filter(particle => particle.life > 0 && particle.y < window.innerHeight + 50);

      onParticleUpdate(updatedParticles);
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [particles, onParticleUpdate]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {particles.map(particle => {
        const opacity = particle.life / particle.maxLife;
        const scale = particle.size / 10;
        
        return (
          <div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              opacity: opacity,
              transform: `scale(${scale})`,
              color: particle.color,
              fontSize: '12px',
              textShadow: '0 0 6px currentColor',
              filter: particle.type === 'spark' ? 'blur(0.5px)' : 'none',
            }}
          >
            {particle.type === 'feather' && '🪶'}
            {particle.type === 'spark' && '✨'}
            {particle.type === 'blood' && '💥'}
            {particle.type === 'muzzle' && '🔥'}
          </div>
        );
      })}
    </div>
  );
};

export const createExplosionParticles = (x: number, y: number, particleId: number): Particle[] => {
  const particles: Particle[] = [];
  
  // Feathers
  for (let i = 0; i < 8; i++) {
    particles.push({
      id: particleId * 100 + i,
      x: x + Math.random() * 20 - 10,
      y: y + Math.random() * 20 - 10,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 2,
      life: 60 + Math.random() * 40,
      maxLife: 100,
      size: 8 + Math.random() * 4,
      color: `hsl(${20 + Math.random() * 20}, 60%, ${50 + Math.random() * 20}%)`,
      type: 'feather',
    });
  }

  // Sparks
  for (let i = 0; i < 12; i++) {
    particles.push({
      id: particleId * 100 + i + 20,
      x: x + Math.random() * 10 - 5,
      y: y + Math.random() * 10 - 5,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12 - 3,
      life: 30 + Math.random() * 20,
      maxLife: 50,
      size: 6 + Math.random() * 3,
      color: `hsl(${40 + Math.random() * 20}, 90%, ${70 + Math.random() * 20}%)`,
      type: 'spark',
    });
  }

  return particles;
};

export const createMuzzleFlash = (x: number, y: number, particleId: number): Particle[] => {
  const particles: Particle[] = [];
  
  for (let i = 0; i < 6; i++) {
    particles.push({
      id: particleId * 50 + i,
      x: x + Math.random() * 30 - 15,
      y: y + Math.random() * 30 - 15,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 15 + Math.random() * 10,
      maxLife: 25,
      size: 15 + Math.random() * 8,
      color: `hsl(${30 + Math.random() * 30}, 100%, ${80 + Math.random() * 20}%)`,
      type: 'muzzle',
    });
  }

  return particles;
};