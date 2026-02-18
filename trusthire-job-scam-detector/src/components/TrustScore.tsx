import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TrustScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

const TrustScore = ({ score, size = "lg" }: TrustScoreProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // Determine color based on score
  const getScoreColor = (value: number) => {
    if (value >= 80) return "score-safe";
    if (value >= 50) return "score-caution";
    return "score-danger";
  };

  const getScoreLabel = (value: number) => {
    if (value >= 80) return "Safe";
    if (value >= 50) return "Caution";
    return "High Risk";
  };

  // Animate score counting up
  useEffect(() => {
    setIsAnimating(true);
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), score);
      setAnimatedScore(current);

      if (step >= steps) {
        clearInterval(timer);
        setIsAnimating(false);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  // Size configurations
  const sizeConfig = {
    sm: {
      containerSize: "h-24 w-24",
      strokeWidth: 6,
      radius: 40,
      fontSize: "text-2xl",
      labelSize: "text-xs",
    },
    md: {
      containerSize: "h-36 w-36",
      strokeWidth: 8,
      radius: 58,
      fontSize: "text-4xl",
      labelSize: "text-sm",
    },
    lg: {
      containerSize: "h-48 w-48",
      strokeWidth: 10,
      radius: 80,
      fontSize: "text-5xl",
      labelSize: "text-base",
    },
  };

  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
  const colorClass = getScoreColor(animatedScore);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={cn("relative", config.containerSize)}>
        {/* Background circle */}
        <svg className="h-full w-full -rotate-90 transform">
          <circle
            cx="50%"
            cy="50%"
            r={config.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className="text-muted"
          />
          {/* Animated progress circle */}
          <circle
            cx="50%"
            cy="50%"
            r={config.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn(
              "transition-all duration-100 ease-out",
              colorClass === "score-safe" && "text-success",
              colorClass === "score-caution" && "text-caution",
              colorClass === "score-danger" && "text-destructive"
            )}
          />
        </svg>

        {/* Score Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "font-bold tabular-nums transition-colors",
              config.fontSize,
              colorClass === "score-safe" && "text-success",
              colorClass === "score-caution" && "text-caution",
              colorClass === "score-danger" && "text-destructive"
            )}
          >
            {animatedScore}
          </span>
          <span className="text-xs text-muted-foreground">out of 100</span>
        </div>
      </div>

      {/* Score Label */}
      <div
        className={cn(
          "rounded-full px-4 py-1.5 font-medium transition-all",
          config.labelSize,
          colorClass === "score-safe" && "bg-success/10 text-success",
          colorClass === "score-caution" && "bg-caution/10 text-caution",
          colorClass === "score-danger" && "bg-destructive/10 text-destructive",
          isAnimating && "animate-pulse"
        )}
      >
        {getScoreLabel(animatedScore)}
      </div>
    </div>
  );
};

export default TrustScore;
