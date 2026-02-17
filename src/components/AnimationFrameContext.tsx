import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

const AnimationFrameContext = createContext(0);

export const AnimationFrameProvider = ({ children }: { children: ReactNode }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setFrame(f => f + 1), 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimationFrameContext.Provider value={frame}>
      {children}
    </AnimationFrameContext.Provider>
  );
};

export const useAnimationFrame = () => useContext(AnimationFrameContext);
