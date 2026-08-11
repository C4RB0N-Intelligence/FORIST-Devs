export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

/** Minimal dot-based step indicator — current step filled Ink Blue, others outlined. */
export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNumber = i + 1;
        const isActive = stepNumber === currentStep;
        const isComplete = stepNumber < currentStep;
        return (
          <span
            key={stepNumber}
            className={[
              "h-1.5 rounded-full transition-all duration-300 ease-out",
              isActive ? "w-8 bg-[#1F3A5F]" : isComplete ? "w-1.5 bg-[#1F3A5F]" : "w-1.5 bg-[#E8E3DC]",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}
