import { useEffect, useState } from "react";
import { Loader2, Search, Shield, Database, Brain } from "lucide-react";
import { processingSteps } from "@/utils/mockAnalysis";

const AnalysisLoader = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let stepTimeout: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    // Progress bar animation
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 0.5;
      });
    }, 25);

    // Cycle through processing steps
    const cycleSteps = () => {
      if (currentStep < processingSteps.length - 1) {
        stepTimeout = setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
          cycleSteps();
        }, processingSteps[currentStep].duration);
      }
    };

    cycleSteps();

    return () => {
      clearTimeout(stepTimeout);
      clearInterval(progressInterval);
    };
  }, [currentStep]);

  const getStepIcon = (index: number) => {
    const icons = [Search, Database, Brain, Shield, Database, Shield];
    const Icon = icons[index % icons.length];
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      {/* Main Loader Animation */}
      <div className="relative mb-8">
        {/* Outer ring */}
        <div className="absolute inset-0 h-28 w-28 rounded-full border-4 border-muted" />
        
        {/* Animated spinning ring */}
        <div className="h-28 w-28 rounded-full border-4 border-transparent border-t-primary animate-spin-slow" />
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary animate-pulse" />
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-xl font-semibold text-foreground">
        Analyzing Documents
      </h3>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Our AI is examining your documents for potential red flags
      </p>

      {/* Progress Bar */}
      <div className="mb-6 w-full max-w-xs">
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Processing Steps */}
      <div className="w-full max-w-sm space-y-3">
        {processingSteps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 rounded-lg border p-3 transition-all duration-300 ${
              index === currentStep
                ? "border-primary bg-primary/5"
                : index < currentStep
                ? "border-success/30 bg-success/5"
                : "border-border bg-card opacity-50"
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                index === currentStep
                  ? "bg-primary text-primary-foreground"
                  : index < currentStep
                  ? "bg-success text-success-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index === currentStep ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                getStepIcon(index)
              )}
            </div>
            <span
              className={`text-sm font-medium ${
                index === currentStep
                  ? "text-foreground"
                  : index < currentStep
                  ? "text-success"
                  : "text-muted-foreground"
              }`}
            >
              {step.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisLoader;
