import { cn } from '@/lib/utils';

interface OnboardingStepperProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[]; // No longer used but kept for backwards compatibility
}

export function OnboardingStepper({ currentStep, totalSteps }: OnboardingStepperProps) {
  return (
    <div className="flex justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNumber = i + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        
        return (
          <div
            key={stepNumber}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              isCompleted && "bg-primary",
              isCurrent && "bg-primary",
              !isCompleted && !isCurrent && "bg-muted"
            )}
          />
        );
      })}
    </div>
  );
}
