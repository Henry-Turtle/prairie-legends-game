interface GameUIProps {
  score: number;
  timeLeft: number;
}

export const GameUI = ({ score, timeLeft }: GameUIProps) => {
  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
      <div className="bg-card/80 backdrop-blur-sm rounded-lg px-6 py-3 border border-border">
        <div className="text-sm text-muted-foreground">Score</div>
        <div className="text-2xl font-bold bg-gradient-score bg-clip-text text-transparent">
          {score}
        </div>
      </div>
      
      <div className="bg-card/80 backdrop-blur-sm rounded-lg px-6 py-3 border border-border">
        <div className="text-sm text-muted-foreground">Time Left</div>
        <div className={`text-2xl font-bold ${
          timeLeft <= 10 ? "text-destructive animate-pulse" : "text-foreground"
        }`}>
          {timeLeft}s
        </div>
      </div>
    </div>
  );
};