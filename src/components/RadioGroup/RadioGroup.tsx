import { useId } from 'react';
import './radio-group.css';

export interface RadioOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  legend: string;
  name?: string;
  options: readonly RadioOption[];
  value: string;
  onValueChange: (value: string) => void;
  hint?: string;
  error?: string;
  disabled?: boolean;
}

export const RadioGroup = ({
  legend,
  name,
  options,
  value,
  onValueChange,
  hint,
  error,
  disabled = false,
}: RadioGroupProps) => {
  const generatedId = useId();
  const groupName = name ?? `radio-group-${generatedId}`;
  const messageId = hint || error ? `${groupName}-message` : undefined;

  return (
    <fieldset
      className="radio-group"
      disabled={disabled}
      aria-describedby={messageId}
      aria-invalid={error ? true : undefined}
    >
      <legend className="radio-group__legend">{legend}</legend>
      <div className="radio-group__options">
        {options.map((option, index) => {
          const optionId = `${groupName}-${index}`;
          const descriptionId = option.description
            ? `${optionId}-description`
            : undefined;

          return (
            <label className="radio-group__option" key={option.value}>
              <input
                id={optionId}
                type="radio"
                name={groupName}
                value={option.value}
                checked={value === option.value}
                disabled={option.disabled}
                aria-describedby={descriptionId}
                onChange={(event) => onValueChange(event.target.value)}
              />
              <span>
                <span className="radio-group__label">{option.label}</span>
                {option.description && (
                  <span id={descriptionId} className="radio-group__description">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {(error || hint) && (
        <p
          id={messageId}
          className={error ? 'radio-group__error' : 'radio-group__hint'}
        >
          {error ?? hint}
        </p>
      )}
    </fieldset>
  );
};
