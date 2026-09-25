import './cta-button.css';

export interface CTAButtonProps {
  label: string;
  size: 'small' | 'medium' | 'large';
  isSecondary: boolean;
}

export const CTAButton = ({
  label,
  size,
  isSecondary = false,
}: CTAButtonProps) => {
  return (
    <button
      type="button"
      className={[
        'ctabutton',
        `ctabutton-${size}`,
        isSecondary && 'background-secondary',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </button>
  );
};
