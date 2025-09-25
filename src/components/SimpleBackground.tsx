export const SimpleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Prairie sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-300 to-amber-100" />
      
      {/* Distant rolling hills */}
      <div className="absolute bottom-20 left-0 right-0 h-20 opacity-30">
        <svg 
          viewBox="0 0 1200 120" 
          className="w-full h-full" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,120 L0,60 L300,40 L600,50 L900,30 L1200,45 L1200,120 Z" 
            fill="#8B7355"
          />
        </svg>
      </div>
      
      {/* Prairie grass base */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-green-600 to-green-400" />
      
      {/* Animated prairie grass */}
      <div className="absolute bottom-0 left-0 right-0 h-16">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 w-1 bg-green-500 origin-bottom animate-pulse"
            style={{
              left: `${(i * 2.5)}%`,
              height: `${Math.random() * 40 + 20}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 2 + 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Scattered clouds */}
      <div className="absolute top-10 left-10 w-16 h-8 bg-white/70 rounded-full blur-sm opacity-60" />
      <div className="absolute top-20 right-20 w-20 h-10 bg-white/60 rounded-full blur-sm opacity-50" />
      <div className="absolute top-16 left-1/3 w-12 h-6 bg-white/50 rounded-full blur-sm opacity-40" />
    </div>
  );
};