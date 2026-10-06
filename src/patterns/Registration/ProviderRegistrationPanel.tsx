import { TextField } from '../../components/TextField/TextField';
import { TextFieldGroup } from '../../components/TextFieldGroup/TextFieldGroup';

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

export const emptyRegistrationDetails: RegistrationDetails = {
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

export interface ProviderRegistrationPanelProps {
  value: RegistrationDetails;
  onValueChange: (value: RegistrationDetails) => void;
}

export const ProviderRegistrationPanel = ({
  value,
  onValueChange,
}: ProviderRegistrationPanelProps) => (
  <div className="registration__form">
    <p className="registration__description">
      Please enter your information in the registration form below. Required
      fields are indicated with an asterisk (*).{' '}
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
            value={value[field.name]}
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
