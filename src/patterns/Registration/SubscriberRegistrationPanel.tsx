import { RadioGroup } from '../../components/RadioGroup/RadioGroup';
import { TextField } from '../../components/TextField/TextField';
import { validationRules } from '../../components/TextField/validation';
import { TextFieldGroup } from '../../components/TextFieldGroup/TextFieldGroup';

export type SubscriberRelationship = 'subscriber' | 'dependent';

export interface SubscriberRegistrationDetails {
  relationship?: SubscriberRelationship;
  firstName: string;
  lastName: string;
  memberId: string;
  dateOfBirth: string;
  zipCode: string;
  dependentFirstName: string;
  dependentLastName: string;
  dependentDateOfBirth: string;
}

export const emptySubscriberDetails: SubscriberRegistrationDetails = {
  firstName: '',
  lastName: '',
  memberId: '',
  dateOfBirth: '',
  zipCode: '',
  dependentFirstName: '',
  dependentLastName: '',
  dependentDateOfBirth: '',
};

type SubscriberFieldName = Exclude<
  keyof SubscriberRegistrationDetails,
  'relationship'
>;

const fieldGroups: {
  title: string;
  fields: { name: SubscriberFieldName; label: string; birthday?: boolean }[];
}[] = [
  {
    title: 'Subscriber Details',
    fields: [
      { name: 'firstName', label: 'First Name:' },
      { name: 'lastName', label: 'Last Name:' },
      { name: 'memberId', label: 'Member ID:' },
      {
        name: 'dateOfBirth',
        label: 'Date of Birth (mm/dd/yyyy)',
        birthday: true,
      },
      { name: 'zipCode', label: 'Zip Code:' },
    ],
  },
  {
    title: 'Dependent Details',
    fields: [
      { name: 'dependentFirstName', label: 'Dependent First Name:' },
      { name: 'dependentLastName', label: 'Dependent Last Name:' },
      {
        name: 'dependentDateOfBirth',
        label: 'Dependent Date of Birth (mm/dd/yyyy)',
        birthday: true,
      },
    ],
  },
];

export const isSubscriberDetailsComplete = (
  value: SubscriberRegistrationDetails,
) =>
  Boolean(value.relationship) &&
  fieldGroups.every((group) =>
    group.fields.every((field) => value[field.name].trim()),
  ) &&
  !validationRules.birthday(value.dateOfBirth) &&
  !validationRules.birthday(value.dependentDateOfBirth);

export interface SubscriberRegistrationPanelProps {
  value: SubscriberRegistrationDetails;
  onValueChange: (value: SubscriberRegistrationDetails) => void;
}

export const SubscriberRegistrationPanel = ({
  value,
  onValueChange,
}: SubscriberRegistrationPanelProps) => (
  <div className="registration__form registration__subscriber">
    <div className="registration__description">
      <p>
        Please enter your information in the registration form below. Required
        fields are indicated with an asterisk (*).{' '}
        <a href="https://www.deltadental.com/us/en/about-us/contact-us.html">
          Contact us
        </a>{' '}
        if you are having difficulty registering.
      </p>
      <p>
        (Note: Registration of a spouse or adult dependent is not currently
        supported for all states. Please check with the local Delta Dental
        company that handles your dental policy before registering.)
      </p>
    </div>
    <RadioGroup
      legend="Which describes you?"
      layout="inline"
      options={[
        { label: 'I am the Subscriber', value: 'subscriber' },
        { label: 'I am a covered dependent', value: 'dependent' },
      ]}
      value={value.relationship}
      onValueChange={(relationship) =>
        onValueChange({
          ...value,
          relationship: relationship as SubscriberRelationship,
        })
      }
    />
    {fieldGroups.map((group) => (
      <TextFieldGroup key={group.title} title={group.title}>
        {group.fields.map((field) => (
          <TextField
            key={field.name}
            label={field.label}
            name={field.name}
            type="text"
            value={value[field.name]}
            validate={field.birthday ? 'birthday' : undefined}
            placeholder={field.birthday ? 'mm/dd/yyyy' : undefined}
            onChange={(event) =>
              onValueChange({
                ...value,
                [field.name]: event.target.value,
              })
            }
            required
          />
        ))}
      </TextFieldGroup>
    ))}
  </div>
);
