import { useEffect, useId, useRef } from 'react';
import { StepIndicator } from '../../components/StepIndicator/StepIndicator';
import { TextField } from '../../components/TextField/TextField';
import type { ValidationRule } from '../../components/TextField/validation';
import { TextFieldGroup } from '../../components/TextFieldGroup/TextFieldGroup';
import { WizardButton } from '../../components/WizardButton/WizardButton';

export interface FacilityRegistrationDetails {
  firstName: string;
  lastName: string;
  tin: string;
  facilityName: string;
  facilityNumber: string;
  facilityTelephoneNumber: string;
}

export const emptyFacilityRegistrationDetails: FacilityRegistrationDetails = {
  firstName: '',
  lastName: '',
  tin: '',
  facilityName: '',
  facilityNumber: '',
  facilityTelephoneNumber: '',
};

export const facilityRegistrationSteps = [
  { id: 'facility-details', label: 'Enter Facility Details' },
  { id: 'facility-account', label: 'Complete Registration' },
  { id: 'facility-success', label: 'Success' },
] as const;

const fieldGroups: {
  title: string;
  fields: {
    name: keyof FacilityRegistrationDetails;
    label: string;
    hint: string;
    validate: ValidationRule;
  }[];
}[] = [
  {
    title: 'Enter the name of the person completing this registration form.',
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        hint: "Must be 1-31 characters consisting of letters, numbers, or - ' . #",
        validate: (value) =>
          /^[\p{L}0-9\-' .#]{1,31}$/u.test(value)
            ? undefined
            : "Must be 1-31 characters consisting of letters, numbers, or - ' . #",
      },
      {
        name: 'lastName',
        label: 'Last Name',
        hint: "Must be 1-35 characters consisting of letters, numbers, or - ' . #",
        validate: (value) =>
          /^[\p{L}0-9\-' .#]{1,35}$/u.test(value)
            ? undefined
            : "Must be 1-35 characters consisting of letters, numbers, or - ' . #",
      },
    ],
  },
  {
    title:
      'Enter information about your facility. This will be used to validate your registration request.',
    fields: [
      {
        name: 'tin',
        label: 'Taxpayer Identification Number (TIN)',
        hint: 'Must be a 9-digit number without spaces or hyphens.',
        validate: (value) =>
          /^\d{9}$/.test(value)
            ? undefined
            : 'Must be a 9-digit number without spaces or hyphens.',
      },
      {
        name: 'facilityName',
        label: 'Facility Name',
        hint: 'Must be at least 1 and no more than 40 characters. Any character is accepted except a double quote (").',
        validate: (value) =>
          /^[^"]{1,40}$/.test(value)
            ? undefined
            : 'Must be at least 1 and no more than 40 characters. Any character is accepted except a double quote (").',
      },
      {
        name: 'facilityNumber',
        label: 'Facility Number',
        hint: 'Must be at least 1 and no more than 6 characters. Both letters and numbers are accepted but no special characters.',
        validate: (value) =>
          /^[a-zA-Z0-9]{1,6}$/.test(value)
            ? undefined
            : 'Must be at least 1 and no more than 6 characters. Both letters and numbers are accepted but no special characters.',
      },
      {
        name: 'facilityTelephoneNumber',
        label: 'Facility Telephone Number',
        hint: 'Must be exactly 10 digits long. Letters and special characters are not allowed.',
        validate: (value) =>
          /^\d{10}$/.test(value)
            ? undefined
            : 'Must be exactly 10 digits long. Letters and special characters are not allowed.',
      },
    ],
  },
];

export const isFacilityRegistrationDetailsComplete = (
  value: FacilityRegistrationDetails,
) =>
  fieldGroups.every((group) =>
    group.fields.every(
      (field) => value[field.name].trim() && !field.validate(value[field.name]),
    ),
  );

export interface FacilityRegistrationPanelProps {
  value: FacilityRegistrationDetails;
  onValueChange: (value: FacilityRegistrationDetails) => void;
  onCancel: () => void;
  onContinue: () => void;
}

export const FacilityRegistrationPanel = ({
  value,
  onValueChange,
  onCancel,
  onContinue,
}: FacilityRegistrationPanelProps) => {
  const headingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isComplete = isFacilityRegistrationDetailsComplete(value);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section
      className="registration__facility-panel"
      aria-labelledby={headingId}
    >
      <StepIndicator
        steps={facilityRegistrationSteps}
        currentStep={0}
        ariaLabel="Facility registration progress"
      />
      <div className="registration__facility-content">
        <h2 id={headingId} ref={headingRef} tabIndex={-1}>
          Facility Registration
        </h2>
        <p className="registration__facility-intro">
          Please enter the following information. (* = required)
        </p>
        <form
          className="registration__facility-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (isComplete) onContinue();
          }}
        >
          {fieldGroups.map((group) => (
            <TextFieldGroup key={group.title} title={group.title}>
              {group.fields.map((field) => (
                <TextField
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  value={value[field.name]}
                  hint={field.hint}
                  validate={field.validate}
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
          <footer className="wizard__actions">
            <WizardButton label="Cancel" type="button" onClick={onCancel} />
            <WizardButton
              label="Continue"
              type="submit"
              disabled={!isComplete}
            />
          </footer>
        </form>
      </div>
    </section>
  );
};
