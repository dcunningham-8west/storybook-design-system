import { useId } from 'react';
import { Radio } from '../Radio/Radio';
import './radio-group.css';

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  legend: string;
  options: readonly RadioOption[];
  value?: string;
  onValueChange: (value: string) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  layout?: 'stacked' | 'inline';
  legendHidden?: boolean;
}

export const RadioGroup = ({
  legend,
  options,
  value,
  onValueChange,
  name,
  required = false,
  disabled = false,
  layout = 'stacked',
  legendHidden = false,
}: RadioGroupProps) => {
  const generatedId = useId();
  const groupName = name ?? `radio-group-${generatedId}`;

  return (
    <fieldset
      className={`radio-group radio-group--${layout}`}
      disabled={disabled}
    >
      <legend
        className={
          legendHidden
            ? 'radio-group__legend radio-group__legend--hidden'
            : 'radio-group__legend'
        }
      >
        {legend}
        {required && ' (required)'}
      </legend>
      <div className="radio-group__options">
        {options.map((option) => (
          <label className="radio-group__option" key={option.value}>
            <Radio
              name={groupName}
              value={option.value}
              checked={value === option.value}
              required={required}
              disabled={option.disabled}
              onChange={(event) => onValueChange(event.target.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};
