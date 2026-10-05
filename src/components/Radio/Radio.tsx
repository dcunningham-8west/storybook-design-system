import type { ComponentProps } from 'react';
import './radio.css';

export type RadioProps = Omit<ComponentProps<'input'>, 'type' | 'children'>;

export const Radio = ({ className, ...props }: RadioProps) => (
  <span className="radio">
    <input
      {...props}
      className={['radio__input', className].filter(Boolean).join(' ')}
      type="radio"
    />
  </span>
);
