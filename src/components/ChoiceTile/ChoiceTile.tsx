import { useId } from 'react';
import { Radio, type RadioProps } from '../Radio/Radio';
import './choice-tile.css';

export interface ChoiceTileProps extends RadioProps {
  label: string;
  description?: string;
}

export const ChoiceTile = ({
  label,
  description,
  id,
  'aria-describedby': ariaDescribedBy,
  ...props
}: ChoiceTileProps) => {
  const generatedId = useId();
  const inputId = id ?? `choice-tile-${generatedId}`;
  const descriptionId = description ? `${inputId}-description` : undefined;

  return (
    <label className="choice-tile">
      <Radio
        {...props}
        id={inputId}
        aria-describedby={
          [ariaDescribedBy, descriptionId].filter(Boolean).join(' ') ||
          undefined
        }
      />
      <span className="choice-tile__text">
        <span className="choice-tile__label">{label}</span>
        {description && (
          <span id={descriptionId} className="choice-tile__description">
            {description}
          </span>
        )}
      </span>
    </label>
  );
};
