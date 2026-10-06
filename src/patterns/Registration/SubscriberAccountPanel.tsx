import { CommunicationConsent } from '../../components/CommunicationConsent/CommunicationConsent';
import {
  ProviderAccountPanel,
  emptyProviderAccount,
  isProviderAccountComplete,
  type ProviderAccountDetails,
  type ProviderAccountSubmission,
} from './ProviderAccountPanel';

export interface SubscriberAccountDetails extends ProviderAccountDetails {
  emailConsent?: boolean;
  textConsent?: boolean;
}

export interface SubscriberAccountSubmission extends ProviderAccountSubmission {
  emailConsent?: boolean;
  textConsent?: boolean;
}

export const emptySubscriberAccount: SubscriberAccountDetails = {
  ...emptyProviderAccount,
};

export const isSubscriberAccountComplete = (value: SubscriberAccountDetails) =>
  isProviderAccountComplete(value) && Boolean(value.mobileNumber.trim());

const emailDescription =
  'to receive unencrypted email messages containing notifications, reminders, tips and links to surveys and information related to my dental insurance for treatment, payment and healthcare operations purposes from the Delta Dental Company that provides or administers my dental benefits and coverage and its authorized service providers (including Delta Dental) at the email address I have provided. These email messages may include protected health information, and I understand that, because these email messages are not encrypted, there is some risk that the messages could be read by someone other than me. I understand that I am not required to provide this consent. The Delta Dental Company that provides or administers my dental benefits and coverage will not condition my eligibility for benefits, treatment, enrollment or payment of claims on whether I provide this consent.';

const textDescription =
  'to receive automated text messages containing notifications, reminders, tips and links to surveys and information related to my dental insurance for treatment, payment and healthcare operations purposes from the Delta Dental Company that provides or administers my dental benefits and coverage, and its authorized service providers (including Delta Dental), at the mobile phone number I have provided. These text messages may include protected health information, and I understand that text messages are not encrypted; therefore, there is some risk that the messages could be read by someone other than me. I understand that I am not required to provide this consent. The Delta Dental Company that provides or administers my dental benefits and coverage will not condition my eligibility for benefits, treatment, enrollment or payment of claims on whether I provide this consent. Message frequency varies. Reply "HELP" for help, and reply "STOP" to cancel. Message and data rates may apply.';

export interface SubscriberAccountPanelProps {
  value: SubscriberAccountDetails;
  onValueChange: (value: SubscriberAccountDetails) => void;
}

export const SubscriberAccountPanel = ({
  value,
  onValueChange,
}: SubscriberAccountPanelProps) => (
  <ProviderAccountPanel
    value={value}
    onValueChange={(account) => onValueChange({ ...value, ...account })}
    mobileRequired
    showDescription={false}
    contactDetails={{
      email: (
        <CommunicationConsent
          label="Email consent"
          description={emailDescription}
          value={value.emailConsent}
          onValueChange={(emailConsent) =>
            onValueChange({ ...value, emailConsent })
          }
        />
      ),
      mobileNumber: (
        <CommunicationConsent
          label="Text message consent"
          description={textDescription}
          value={value.textConsent}
          onValueChange={(textConsent) =>
            onValueChange({ ...value, textConsent })
          }
        />
      ),
    }}
  />
);
