import { useEffect, useRef, type ReactNode } from 'react';
import { CTAButton } from '../CTAButton/CTAButton';
import {
  StepIndicator,
  type StepIndicatorStep,
} from '../StepIndicator/StepIndicator';
import './wizard.css';

export interface WizardStep extends StepIndicatorStep {
  /** Optional supporting text shown beneath the active step title. */
  description?: string;
}

export interface WizardProps {
  /** Ordered steps displayed in the progress indicator. */
  steps: readonly WizardStep[];
  /** Zero-based index of the active step. */
  currentStep: number;
  /** Content rendered for the active step; compose with design-system controls. */
  children: ReactNode;
  /** Called when the user chooses Back. */
  onBack: () => void;
  /** Called when the user continues to the next step. */
  onNext: () => void;
  /** Called when the user completes the final step. */
  onComplete: () => void;
  /** Disable the primary action until the active step is valid. */
  canContinue?: boolean;
  /** Label for the primary action before the final step. */
  nextLabel?: string;
  /** Label for the primary action on the final step. */
  completeLabel?: string;
}

export const Wizard = ({
  steps,
  currentStep,
  children,
  onBack,
  onNext,
  onComplete,
  canContinue = true,
  nextLabel = 'Continue',
  completeLabel = 'Complete',
}: WizardProps) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  useEffect(() => {
    headingRef.current?.focus();
  }, [currentStep]);

  if (!step) {
    throw new Error('Wizard currentStep must identify an item in steps.');
  }

  return (
    <section className="wizard" aria-labelledby={`${step.id}-title`}>
      <StepIndicator steps={steps} currentStep={currentStep} />

      <div className="wizard__body">
        <p className="wizard__eyebrow">
          Step {currentStep + 1} of {steps.length}
        </p>
        <h2 id={`${step.id}-title`} ref={headingRef} tabIndex={-1}>
          {step.label}
        </h2>
        {step.description && (
          <p className="wizard__description">{step.description}</p>
        )}
        <div className="wizard__content">{children}</div>
      </div>

      <footer className="wizard__actions">
        {currentStep > 0 ? (
          <CTAButton label="Back" size="medium" isSecondary onClick={onBack} />
        ) : (
          <span />
        )}
        <CTAButton
          label={isLastStep ? completeLabel : nextLabel}
          size="medium"
          disabled={!canContinue}
          onClick={isLastStep ? onComplete : onNext}
        />
      </footer>
    </section>
  );
};
