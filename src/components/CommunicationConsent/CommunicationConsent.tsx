import { RadioGroup } from '../RadioGroup/RadioGroup';
import './communication-consent.css';

export interface CommunicationConsentProps {
  label: string;
  description: string;
  value?: boolean;
  onValueChange: (value: boolean) => void;
}

export const CommunicationConsent = ({
  label,
  description,
  value,
  onValueChange,
}: CommunicationConsentProps) => (
  <div className="communication-consent">
    <RadioGroup
      legend={label}
      legendHidden
      layout="inline"
      options={[
        { label: 'I Agree', value: 'agree' },
        { label: 'I Decline', value: 'decline' },
      ]}
      value={value === undefined ? undefined : value ? 'agree' : 'decline'}
      onValueChange={(selection) => onValueChange(selection === 'agree')}
    />
    <p className="communication-consent__description">{description}</p>
  </div>
);
