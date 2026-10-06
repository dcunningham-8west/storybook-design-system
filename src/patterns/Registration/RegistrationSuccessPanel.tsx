import { useEffect, useId, useRef } from 'react';
import { StepIndicator } from '../../components/StepIndicator/StepIndicator';
import type { StepIndicatorStep } from '../../components/StepIndicator/StepIndicator';
import { WizardButton } from '../../components/WizardButton/WizardButton';

export interface RegistrationSuccessPanelProps {
  route: 'provider' | 'subscriber';
  email: string;
  onProceedToSignIn: () => void;
  stepLabel?: string | null;
  progress?: {
    steps: readonly StepIndicatorStep[];
    currentStep: number;
  };
}

export const RegistrationSuccessPanel = ({
  route,
  email,
  onProceedToSignIn,
  stepLabel = 'Registration - step 4 of 4',
  progress,
}: RegistrationSuccessPanelProps) => {
  const titleId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section className="wizard registration__success" aria-labelledby={titleId}>
      {progress && (
        <StepIndicator
          steps={progress.steps}
          currentStep={progress.currentStep}
          ariaLabel="Facility registration progress"
        />
      )}
      <div className="wizard__body">
        {stepLabel && <h2>{stepLabel}</h2>}
        <div className="wizard__content">
          <h2
            className="registration__success-title"
            id={titleId}
            ref={headingRef}
            tabIndex={-1}
          >
            Success
          </h2>
          <p className="registration__description">
            {route === 'provider' ? (
              <>
                Your account registration was successful. To make use of this
                account, it needs to be verified. A message with a verification
                code has been sent to {email}. Please click 'Proceed to sign in'
                to sign in and enter the code.
              </>
            ) : (
              <>
                Your account registration was successful. Please click 'Proceed
                to sign in' to sign in.
              </>
            )}
          </p>
          <footer className="wizard__actions">
            <WizardButton
              label="Proceed to Sign In"
              onClick={onProceedToSignIn}
            />
          </footer>
        </div>
      </div>
    </section>
  );
};
