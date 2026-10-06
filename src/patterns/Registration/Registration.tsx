import { useId, useState } from 'react';
import { RadioGroup } from '../../components/RadioGroup/RadioGroup';
import { TextField } from '../../components/TextField/TextField';
import { TextFieldGroup } from '../../components/TextFieldGroup/TextFieldGroup';
import { Wizard } from '../../components/Wizard/Wizard';
import { RegistrationSuccessPanel } from './RegistrationSuccessPanel';
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
import './registration.css';

export type RegistrationRole = 'dentist' | 'member' | 'facility';
export type RegistrationRoute = 'provider' | 'subscriber';

const routeByRole: Partial<Record<RegistrationRole, RegistrationRoute>> = {
  dentist: 'provider',
  member: 'subscriber',
};

export interface RegistrationDetails {
  firstName: string;
  lastName: string;
  businessTaxId: string;
  businessCity: string;
  businessPostalCode: string;
  dentistFirstName: string;
  dentistLastName: string;
  licenseId: string;
  licenseState: string;
}

export interface RegistrationProps {
  onNext: (
    role: RegistrationRole,
    details?: RegistrationDetails | SubscriberRegistrationDetails,
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

const emptyDetails: RegistrationDetails = {
  firstName: '',
  lastName: '',
  businessTaxId: '',
  businessCity: '',
  businessPostalCode: '',
  dentistFirstName: '',
  dentistLastName: '',
  licenseId: '',
  licenseState: '',
};

const fieldGroups: {
  title: string;
  fields: { name: keyof RegistrationDetails; label: string }[];
}[] = [
  {
    title: 'Enter the name of the person completing this registration form.',
    fields: [
      { name: 'firstName', label: 'First Name:' },
      { name: 'lastName', label: 'Last Name:' },
    ],
  },
  {
    title:
      'Enter information about your office. This will be used to determine your office location for mailing purposes.',
    fields: [
      { name: 'businessTaxId', label: 'Business Tax ID:' },
      { name: 'businessCity', label: 'Business City:' },
      { name: 'businessPostalCode', label: 'Business Postal Code:' },
    ],
  },
  {
    title:
      'Enter information about a dentist in your office. This will be used to validate your registration request.',
    fields: [
      { name: 'dentistFirstName', label: 'Dentist First Name:' },
      { name: 'dentistLastName', label: 'Dentist Last Name:' },
      { name: 'licenseId', label: 'License ID:' },
      { name: 'licenseState', label: 'License State:' },
    ],
  },
];

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
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3>(
    initialRole && routeByRole[initialRole] ? initialStep : 0,
  );
  const [role, setRole] = useState<RegistrationRole | undefined>(initialRole);
  const route = role ? routeByRole[role] : undefined;
  const [verificationEmail, setVerificationEmail] = useState(
    initialVerificationEmail,
  );
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string>();
  const [details, setDetails] = useState(emptyDetails);
  const detailsComplete = Object.values(details).every((value) => value.trim());
  const [subscriberDetails, setSubscriberDetails] = useState(
    emptySubscriberDetails,
  );
  const [providerAccount, setProviderAccount] = useState(emptyProviderAccount);
  const providerAccountComplete = isProviderAccountComplete(providerAccount);
  const [subscriberAccount, setSubscriberAccount] = useState(
    emptySubscriberAccount,
  );
  const activeAccountComplete =
    route === 'provider'
      ? providerAccountComplete
      : isSubscriberAccountComplete(subscriberAccount);
  const activeDetailsComplete =
    route === 'provider'
      ? detailsComplete
      : isSubscriberDetailsComplete(subscriberDetails);
  const steps = Array.from({ length: 4 }, (_, index) => ({
    id: `registration-${instanceId}-${index + 1}`,
    label: `Registration - step ${index + 1} of 4`,
  }));

  const registerAccount = async () => {
    if (!route || !activeAccountComplete || isRegistering) return;
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
    } else if (currentStep === 2) {
      void registerAccount();
    }
  };

  if (currentStep === 3 && route) {
    return (
      <main className="registration" data-registration-route={route}>
        <RegistrationSuccessPanel
          route={route}
          email={verificationEmail}
          onProceedToSignIn={() => onProceedToSignIn?.(route)}
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
        ) : currentStep === 2 ? (
          <SubscriberAccountPanel
            value={subscriberAccount}
            onValueChange={setSubscriberAccount}
          />
        ) : route === 'provider' ? (
          <div className="registration__form">
            <p className="registration__description">
              Please enter your information in the registration form below.
              Required fields are indicated with an asterisk (*).{' '}
              <a href="https://www.deltadental.com/us/en/about-us/contact-us.html">
                Contact us
              </a>{' '}
              if you are having difficulty registering.
            </p>
            {fieldGroups.map((group) => (
              <TextFieldGroup key={group.title} title={group.title}>
                {group.fields.map((field) => (
                  <TextField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    type="text"
                    value={details[field.name]}
                    onChange={(event) =>
                      setDetails((current) => ({
                        ...current,
                        [field.name]: event.target.value,
                      }))
                    }
                    required
                  />
                ))}
              </TextFieldGroup>
            ))}
          </div>
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
