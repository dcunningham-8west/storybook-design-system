import type { ReactNode } from 'react';
import { TextField } from '../../components/TextField/TextField';
import { TextFieldGroup } from '../../components/TextFieldGroup/TextFieldGroup';

export interface ProviderAccountDetails {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  mobileNumber: string;
  challengeQuestion: string;
  challengeAnswer: string;
}

export type ProviderAccountSubmission = Omit<
  ProviderAccountDetails,
  'confirmPassword'
>;

export const emptyProviderAccount: ProviderAccountDetails = {
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  mobileNumber: '',
  challengeQuestion: '',
  challengeAnswer: '',
};

const validateEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+$/.test(value.trim())
    ? undefined
    : 'Enter a valid email address.';

export const isProviderAccountComplete = (value: ProviderAccountDetails) =>
  [
    value.username,
    value.password,
    value.confirmPassword,
    value.email,
    value.challengeQuestion,
    value.challengeAnswer,
  ].every((field) => field.trim()) &&
  value.password === value.confirmPassword &&
  !validateEmail(value.email);

export const toProviderAccountSubmission = (
  value: ProviderAccountDetails,
): ProviderAccountSubmission => ({
  username: value.username,
  password: value.password,
  email: value.email,
  mobileNumber: value.mobileNumber,
  challengeQuestion: value.challengeQuestion,
  challengeAnswer: value.challengeAnswer,
});

const fieldGroups: {
  title: string;
  fields: {
    name: keyof ProviderAccountDetails;
    label: string;
    type: 'text' | 'password' | 'email' | 'tel';
    autoComplete?: string;
    optional?: boolean;
  }[];
}[] = [
  {
    title:
      'Please enter a username that will be used for your identification. Also, please enter a password which will be used along with your username to log you onto our system.',
    fields: [
      {
        name: 'username',
        label: 'Username:',
        type: 'text',
        autoComplete: 'username',
      },
      {
        name: 'password',
        label: 'Password:',
        type: 'password',
        autoComplete: 'new-password',
      },
      {
        name: 'confirmPassword',
        label: 'Confirm Password:',
        type: 'password',
        autoComplete: 'new-password',
      },
    ],
  },
  {
    title: 'Please enter your contact information.',
    fields: [
      { name: 'email', label: 'Email:', type: 'email', autoComplete: 'email' },
      {
        name: 'mobileNumber',
        label: 'Mobile Number:',
        type: 'tel',
        autoComplete: 'tel',
        optional: true,
      },
    ],
  },
  {
    title:
      'Select a challenge question and enter an answer. If you forget your password, the system will prompt you with the challenge question. If you provide the answer entered below, you will be given a new password.',
    fields: [
      { name: 'challengeQuestion', label: 'Challenge Question:', type: 'text' },
      { name: 'challengeAnswer', label: 'Challenge Answer:', type: 'text' },
    ],
  },
];

export interface ProviderAccountPanelProps {
  value: ProviderAccountDetails;
  onValueChange: (value: ProviderAccountDetails) => void;
  mobileRequired?: boolean;
  showDescription?: boolean;
  contactDetails?: Partial<Record<'email' | 'mobileNumber', ReactNode>>;
}

export const ProviderAccountPanel = ({
  value,
  onValueChange,
  mobileRequired = false,
  showDescription = true,
  contactDetails,
}: ProviderAccountPanelProps) => (
  <div className="registration__form">
    {showDescription && (
      <p className="registration__description">
        Please enter your information in the registration form below. Required
        fields are indicated with an asterisk (*).
      </p>
    )}
    {fieldGroups.map((group) => (
      <TextFieldGroup key={group.title} title={group.title}>
        {group.fields.map((field) => (
          <div key={field.name}>
            <TextField
              label={field.label}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              value={value[field.name]}
              validate={
                field.name === 'email'
                  ? validateEmail
                  : field.name === 'confirmPassword'
                    ? (confirmation) =>
                        confirmation === value.password
                          ? undefined
                          : 'Passwords must match.'
                    : undefined
              }
              onChange={(event) =>
                onValueChange({
                  ...value,
                  [field.name]: event.target.value,
                })
              }
              required={!field.optional || mobileRequired}
            />
            {(field.name === 'email' || field.name === 'mobileNumber') &&
              contactDetails?.[field.name]}
          </div>
        ))}
      </TextFieldGroup>
    ))}
  </div>
);
