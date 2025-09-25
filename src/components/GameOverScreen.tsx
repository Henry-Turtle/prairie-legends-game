import { Button } from "./ui/button";

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

export const GameOverScreen = ({ score, onRestart }: GameOverScreenProps) => {
  const getScoreMessage = (score: number) => {
    if (score >= 200) return "🏆 Turkey Master!";
    if (score >= 100) return "🎯 Great Shot!";
    if (score >= 50) return "👍 Not Bad!";
    return "🎯 Keep Practicing!";
  };

  return (
    <div className="min-h-screen bg-gradient-forest flex items-center justify-center">
      <div className="bg-card/90 backdrop-blur-sm rounded-xl p-8 border border-border text-center max-w-md">
        <h2 className="text-4xl font-bold text-foreground mb-4">Game Over!</h2>
        
        <div className="mb-6">
          <div className="text-lg text-muted-foreground mb-2">Final Score</div>
          <div className="text-5xl font-bold bg-gradient-score bg-clip-text text-transparent mb-4">
            {score}
          </div>
          <div className="text-xl text-accent font-semibold">
            {getScoreMessage(score)}
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={onRestart}
            size="lg"
            className="w-full bg-gradient-autumn text-foreground hover:scale-105 transition-transform"
          >
            Hunt Again
          </Button>
        </div>
      </div>
    </div>
  );
};