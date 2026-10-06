import { useId, useState } from 'react';
import { RadioGroup } from '../../components/RadioGroup/RadioGroup';
import { StepIndicator } from '../../components/StepIndicator/StepIndicator';
import { Wizard } from '../../components/Wizard/Wizard';
import { RegistrationSuccessPanel } from './RegistrationSuccessPanel';
import {
  ProviderRegistrationPanel,
  emptyRegistrationDetails,
  type RegistrationDetails,
} from './ProviderRegistrationPanel';
export type { RegistrationDetails } from './ProviderRegistrationPanel';
import {
  ProviderAccountPanel,
  emptyProviderAccount,
  isProviderAccountComplete,
  toProviderAccountSubmission,
  type ProviderAccountSubmission,
} from './ProviderAccountPanel';
import {
  SubscriberAccountPanel,
  emptySubscriberAccount,
  isSubscriberAccountComplete,
  type SubscriberAccountSubmission,
} from './SubscriberAccountPanel';
import {
  SubscriberRegistrationPanel,
  emptySubscriberDetails,
  isSubscriberDetailsComplete,
  type SubscriberRegistrationDetails,
} from './SubscriberRegistrationPanel';
import {
  FacilityRegistrationPanel,
  emptyFacilityRegistrationDetails,
  facilityRegistrationSteps,
  isFacilityRegistrationDetailsComplete,
  type FacilityRegistrationDetails,
} from './FacilityRegistrationPanel';
import './registration.css';

export type RegistrationRole = 'dentist' | 'member' | 'facility';
export type RegistrationRoute = 'provider' | 'subscriber' | 'facility';

const routeByRole: Record<RegistrationRole, RegistrationRoute> = {
  dentist: 'provider',
  member: 'subscriber',
  facility: 'facility',
};

export interface RegistrationProps {
  onNext: (
    role: RegistrationRole,
    details?:
      | RegistrationDetails
      | SubscriberRegistrationDetails
      | FacilityRegistrationDetails,
  ) => void;
  onRegister?: (
    provider: RegistrationDetails,
    account: ProviderAccountSubmission,
  ) => void | Promise<void>;
  onSubscriberRegister?: (
    subscriber: SubscriberRegistrationDetails,
    account: SubscriberAccountSubmission,
  ) => void | Promise<void>;
  onProceedToSignIn?: (route: RegistrationRoute) => void;
  initialStep?: 0 | 1 | 2 | 3;
  initialRole?: RegistrationRole;
  initialVerificationEmail?: string;
}

const roleOptions = [
  {
    label: 'I am either a dentist or associated with a dentist.',
    value: 'dentist',
  },
  {
    label:
      'I am a member or adult dependent and have coverage with Delta Dental.',
    value: 'member',
  },
  {
    label: 'I am a DeltaCare\u00ae facility.',
    value: 'facility',
  },
] as const;

export const Registration = ({
  onNext,
  onRegister,
  onSubscriberRegister,
  onProceedToSignIn,
  initialStep = 0,
  initialRole,
  initialVerificationEmail = 'tnussbaumer@deltadental.com',
}: RegistrationProps) => {
  const instanceId = useId();
  const initialRegistrationStep =
    initialRole && routeByRole[initialRole] ? initialStep : 0;
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3>(
    initialRegistrationStep,
  );
  const [role, setRole] = useState<RegistrationRole | undefined>(initialRole);
  const route = role ? routeByRole[role] : undefined;
  const [verificationEmail, setVerificationEmail] = useState(
    initialVerificationEmail,
  );
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string>();
  const [details, setDetails] = useState(emptyRegistrationDetails);
  const detailsComplete = Object.values(details).every((value) => value.trim());
  const [subscriberDetails, setSubscriberDetails] = useState(
    emptySubscriberDetails,
  );
  const [facilityDetails, setFacilityDetails] = useState(
    emptyFacilityRegistrationDetails,
  );
  const [providerAccount, setProviderAccount] = useState(emptyProviderAccount);
  const providerAccountComplete = isProviderAccountComplete(providerAccount);
  const [subscriberAccount, setSubscriberAccount] = useState(
    emptySubscriberAccount,
  );
  const activeAccountComplete =
    route === 'provider'
      ? providerAccountComplete
      : route === 'subscriber'
        ? isSubscriberAccountComplete(subscriberAccount)
        : false;
  const activeDetailsComplete =
    route === 'provider'
      ? detailsComplete
      : route === 'subscriber'
        ? isSubscriberDetailsComplete(subscriberDetails)
        : isFacilityRegistrationDetailsComplete(facilityDetails);
  const steps = Array.from({ length: 4 }, (_, index) => ({
    id: `registration-${instanceId}-${index + 1}`,
    label: `Registration - step ${index + 1} of 4`,
  }));

  const registerAccount = async () => {
    if (
      !route ||
      route === 'facility' ||
      !activeAccountComplete ||
      isRegistering
    )
      return;
    setIsRegistering(true);
    setRegistrationError(undefined);
    try {
      if (route === 'provider') {
        await onRegister?.(
          details,
          toProviderAccountSubmission(providerAccount),
        );
        setVerificationEmail(providerAccount.email.trim());
      } else {
        await onSubscriberRegister?.(subscriberDetails, {
          ...toProviderAccountSubmission(subscriberAccount),
          emailConsent: subscriberAccount.emailConsent,
          textConsent: subscriberAccount.textConsent,
        });
      }
      setProviderAccount(emptyProviderAccount);
      setSubscriberAccount(emptySubscriberAccount);
      setCurrentStep(3);
    } catch {
      setRegistrationError(
        'We could not complete your registration. Please try again.',
      );
    } finally {
      setIsRegistering(false);
    }
  };

  const continueRegistration = () => {
    if (!role || !route) return;
    if (currentStep === 0) {
      setCurrentStep(1);
      onNext(role);
    } else if (currentStep === 1 && route === 'provider' && detailsComplete) {
      setCurrentStep(2);
      onNext(role, details);
    } else if (
      currentStep === 1 &&
      route === 'subscriber' &&
      activeDetailsComplete
    ) {
      setCurrentStep(2);
      onNext(role, subscriberDetails);
    } else if (
      currentStep === 1 &&
      route === 'facility' &&
      activeDetailsComplete
    ) {
      setCurrentStep(2);
      onNext(role, facilityDetails);
    } else if (currentStep === 2) {
      void registerAccount();
    }
  };

  if (currentStep === 1 && route === 'facility') {
    return (
      <main className="registration" data-registration-route={route}>
        <FacilityRegistrationPanel
          value={facilityDetails}
          onValueChange={setFacilityDetails}
          onCancel={() => {
            setRole(undefined);
            setCurrentStep(0);
          }}
          onContinue={() => {
            if (role) {
              setCurrentStep(2);
              onNext(role, facilityDetails);
            }
          }}
        />
      </main>
    );
  }

  if (currentStep === 2 && route === 'facility') {
    return (
      <main className="registration" data-registration-route={route}>
        <section className="registration__facility-panel">
          <StepIndicator
            steps={facilityRegistrationSteps}
            currentStep={1}
            ariaLabel="Facility registration progress"
          />
          <Wizard
            steps={[
              {
                id: 'facility-details-complete',
                label: 'Enter Facility Details',
              },
              {
                id: 'facility-complete-registration',
                label: 'Complete Registration',
              },
            ]}
            currentStep={1}
            showProgress={false}
            actionsInContent
            canContinue={detailsComplete}
            nextLabel="Continue"
            completeLabel="Continue"
            onBack={() => setCurrentStep(1)}
            onNext={() => undefined}
            onComplete={() => {
              if (role && detailsComplete) {
                setCurrentStep(3);
                onNext(role, details);
              }
            }}
          >
            <ProviderRegistrationPanel
              value={details}
              onValueChange={setDetails}
            />
          </Wizard>
        </section>
      </main>
    );
  }

  if (
    currentStep === 3 &&
    (route === 'provider' || route === 'subscriber' || route === 'facility')
  ) {
    return (
      <main className="registration" data-registration-route={route}>
        <RegistrationSuccessPanel
          route={route === 'facility' ? 'provider' : route}
          email={verificationEmail}
          onProceedToSignIn={() => onProceedToSignIn?.(route)}
          stepLabel={route === 'facility' ? null : 'Registration - step 4 of 4'}
          progress={
            route === 'facility'
              ? { steps: facilityRegistrationSteps, currentStep: 2 }
              : undefined
          }
        />
      </main>
    );
  }

  return (
    <main className="registration" data-registration-route={route}>
      <Wizard
        steps={steps}
        currentStep={currentStep}
        showProgress={false}
        actionsInContent
        canContinue={
          !isRegistering &&
          Boolean(route) &&
          (currentStep === 0 ||
            (currentStep === 1 ? activeDetailsComplete : activeAccountComplete))
        }
        nextLabel={currentStep === 2 ? 'Register user' : 'Next'}
        onBack={() => {
          if (!isRegistering) {
            setRegistrationError(undefined);
            setCurrentStep(currentStep === 2 ? 1 : 0);
          }
        }}
        onNext={continueRegistration}
        onComplete={continueRegistration}
      >
        {registrationError && <p role="alert">{registrationError}</p>}
        {currentStep === 0 ? (
          <RadioGroup
            legend="Which describes you?"
            options={roleOptions}
            value={role}
            onValueChange={(value) => setRole(value as RegistrationRole)}
            required
          />
        ) : currentStep === 2 && route === 'provider' ? (
          <ProviderAccountPanel
            value={providerAccount}
            onValueChange={setProviderAccount}
          />
        ) : currentStep === 2 && route === 'subscriber' ? (
          <SubscriberAccountPanel
            value={subscriberAccount}
            onValueChange={setSubscriberAccount}
          />
        ) : route === 'provider' ? (
          <ProviderRegistrationPanel
            value={details}
            onValueChange={setDetails}
          />
        ) : (
          <SubscriberRegistrationPanel
            value={subscriberDetails}
            onValueChange={setSubscriberDetails}
          />
        )}
      </Wizard>
    </main>
  );
};
