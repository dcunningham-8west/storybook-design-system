import { useId } from 'react';
import { ChoiceTile } from '../ChoiceTile/ChoiceTile';
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
        {options.map((option, index) => (
          <ChoiceTile
            key={option.value}
            {...option}
            id={`${groupName}-${index}`}
            name={groupName}
            checked={value === option.value}
            onChange={(event) => onValueChange(event.target.value)}
          />
        ))}
      </div>
    </fieldset>
  );
};
