import { useEffect, useId, useRef } from 'react';
import { CTAButton } from '../../components/CTAButton/CTAButton';

export interface RegistrationSuccessPanelProps {
  route: 'provider' | 'subscriber';
  email: string;
  onProceedToSignIn: () => void;
}

export const RegistrationSuccessPanel = ({
  route,
  email,
  onProceedToSignIn,
}: RegistrationSuccessPanelProps) => {
  const titleId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section className="wizard registration__success" aria-labelledby={titleId}>
      <div className="wizard__body">
        <h2>Registration - step 4 of 4</h2>
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
            <CTAButton label="Proceed to Sign In" onClick={onProceedToSignIn} />
          </footer>
        </div>
      </div>
    </section>
  );
};
