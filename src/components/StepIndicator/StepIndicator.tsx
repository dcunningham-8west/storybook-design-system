import './step-indicator.css';

export interface StepIndicatorStep {
  id: string;
  label: string;
}

export interface StepIndicatorProps {
  steps: readonly StepIndicatorStep[];
  currentStep: number;
  ariaLabel?: string;
}

export const StepIndicator = ({
  steps,
  currentStep,
  ariaLabel = 'Progress',
}: StepIndicatorProps) => {
  if (!steps[currentStep]) {
    throw new Error(
      'StepIndicator currentStep must identify an item in steps.',
    );
  }

  return (
    <nav className="step-indicator" aria-label={ariaLabel}>
      <ol className="step-indicator__list">
        {steps.map((step, index) => {
          const state =
            index < currentStep
              ? 'complete'
              : index === currentStep
                ? 'current'
                : 'upcoming';

          return (
            <li
              className="step-indicator__step"
              key={step.id}
              data-state={state}
              aria-current={state === 'current' ? 'step' : undefined}
            >
              <span className="step-indicator__number" aria-hidden="true">
                {state === 'complete' ? '✓' : index + 1}
              </span>
              <span className="step-indicator__label">{step.label}</span>
              {state === 'complete' && (
                <span className="step-indicator__sr-only"> (completed)</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
