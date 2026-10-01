import type { ComponentPropsWithoutRef } from 'react';
import './cta-button.css';

export interface CTAButtonProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'children'
> {
  label: string;
  size?: 'small' | 'medium' | 'large';
  isSecondary?: boolean;
}

export const CTAButton = ({
  label,
  size = 'medium',
  isSecondary = false,
  className,
  ...buttonProps
}: CTAButtonProps) => {
  return (
    <button
      {...buttonProps}
      type={buttonProps.type ?? 'button'}
      className={[
        'ctabutton',
        `ctabutton-${size}`,
        isSecondary && 'background-secondary',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </button>
  );
};
