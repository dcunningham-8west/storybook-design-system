import { useId, type ComponentPropsWithoutRef } from 'react';
import './text-field.css';

export interface TextFieldProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'size'
> {
  label: string;
  hint?: string;
  error?: string;
}

export const TextField = ({
  label,
  hint,
  error,
  id,
  className,
  'aria-describedby': ariaDescribedBy,
  ...inputProps
}: TextFieldProps) => {
  const generatedId = useId();
  const inputId = id ?? `text-field-${generatedId}`;
  const messageId = hint || error ? `${inputId}-message` : undefined;
  const describedBy = [ariaDescribedBy, messageId].filter(Boolean).join(' ');

  return (
    <div className={['text-field', className].filter(Boolean).join(' ')}>
      <label className="text-field__label" htmlFor={inputId}>
        {label}
        {inputProps.required && (
          <span className="text-field__required" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        {...inputProps}
        id={inputId}
        className="text-field__input"
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : inputProps['aria-invalid']}
      />
      {(error || hint) && (
        <p
          id={messageId}
          className={error ? 'text-field__error' : 'text-field__hint'}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
};
