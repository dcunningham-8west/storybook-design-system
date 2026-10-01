import { useId } from 'react';
import './choice-tile-group.css';

export interface ChoiceTileOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface ChoiceTileGroupProps {
  legend: string;
  options: readonly ChoiceTileOption[];
  value?: string;
  onValueChange: (value: string) => void;
  name?: string;
  hint?: string;
}

export const ChoiceTileGroup = ({
  legend,
  options,
  value,
  onValueChange,
  name,
  hint,
}: ChoiceTileGroupProps) => {
  const generatedId = useId();
  const groupName = name ?? `choice-tile-group-${generatedId}`;
  const hintId = hint ? `${groupName}-hint` : undefined;

  return (
    <fieldset className="choice-tile-group" aria-describedby={hintId}>
      <legend className="choice-tile-group__legend">{legend}</legend>
      {hint && (
        <p id={hintId} className="choice-tile-group__hint">
          {hint}
        </p>
      )}
      <div className="choice-tile-group__grid">
        {options.map((option, index) => {
          const optionId = `${groupName}-${index}`;
          const descriptionId = option.description
            ? `${optionId}-description`
            : undefined;

          return (
            <label className="choice-tile" key={option.value}>
              <input
                className="choice-tile__input"
                id={optionId}
                type="radio"
                name={groupName}
                value={option.value}
                checked={value === option.value}
                disabled={option.disabled}
                aria-describedby={descriptionId}
                onChange={(event) => onValueChange(event.target.value)}
              />
              <span className="choice-tile__indicator" aria-hidden="true" />
              <span className="choice-tile__text">
                <span className="choice-tile__label">{option.label}</span>
                {option.description && (
                  <span id={descriptionId} className="choice-tile__description">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};
