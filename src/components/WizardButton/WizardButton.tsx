import type { ComponentPropsWithoutRef } from 'react';
import './wizard-button.css';

export interface WizardButtonProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'children'
> {
  label: string;
}

export const WizardButton = ({
  label,
  className,
  ...buttonProps
}: WizardButtonProps) => (
  <button
    {...buttonProps}
    type={buttonProps.type ?? 'button'}
    className={['wizard-button', className].filter(Boolean).join(' ')}
  >
    {label}
  </button>
);
