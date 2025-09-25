export const SimpleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Simple gradient sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-dusk to-forest-light" />
      
      {/* Subtle mountain silhouettes */}
      <div className="absolute bottom-32 left-0 right-0 h-32 opacity-40">
        <svg 
          viewBox="0 0 1200 200" 
          className="w-full h-full" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,200 L0,120 L200,80 L400,100 L600,60 L800,90 L1000,50 L1200,70 L1200,200 Z" 
            fill="hsl(var(--forest-dark))"
          />
          <path 
            d="M0,200 L0,140 L300,110 L500,130 L700,90 L900,120 L1200,100 L1200,200 Z" 
            fill="hsl(var(--forest-mid))"
          />
        </svg>
      </div>
      
      {/* Simple tree line */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-forest-deep to-forest-dark" />
      
      {/* Minimal light rays */}
      <div className="absolute top-0 left-1/3 w-1 h-full bg-gradient-to-b from-sky-dawn/20 to-transparent opacity-50" />
      <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-autumn-gold/15 to-transparent opacity-50" />
    </div>
  );
};