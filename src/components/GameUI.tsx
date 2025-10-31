import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";

interface GameUIProps {
  score: number;
  timeLeft: number;
  onReset: () => void;
}

export const GameUI = ({ score, timeLeft, onReset }: GameUIProps) => {
  return (
    <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
      <div className="bg-gradient-card backdrop-blur-lg rounded-xl px-8 py-4 border border-border/50 shadow-soft">
        <div className="text-sm text-muted-foreground/80 font-medium">Score</div>
        <div className="text-3xl font-bold bg-gradient-score bg-clip-text text-transparent drop-shadow-glow">
          {score.toLocaleString()}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="bg-gradient-card backdrop-blur-lg rounded-xl px-8 py-4 border border-border/50 shadow-soft">
          <div className="text-sm text-muted-foreground/80 font-medium">Time Left</div>
          <div className={`text-3xl font-bold transition-all duration-300 ${
            timeLeft <= 10 
              ? "text-destructive animate-pulse scale-110 drop-shadow-glow" 
              : "text-foreground"
          }`}>
            {timeLeft}s
          </div>
        </div>
        
        <Button
          onClick={onReset}
          variant="outline"
          size="icon"
          className="bg-gradient-card backdrop-blur-lg border-border/50 shadow-soft hover:bg-destructive/10 hover:border-destructive/30 transition-all"
          title="Reset Game"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};