import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from 'react';
import {
  resolveValidationRule,
  type ValidationRule,
  type ValidationRuleName,
} from './validation';
import './text-field.css';

export interface TextFieldProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'size'
> {
  label: string;
  hint?: string;
  /** Externally controlled error; always wins over `validate`. */
  error?: string;
  /** Turns a standard field into a format-checked one, e.g. `validate="birthday"`. */
  validate?: ValidationRuleName | ValidationRule;
  /** When the message from `validate` appears. Defaults to `blur`. */
  validateOn?: 'blur' | 'change';
  /** Reports validity so forms can gate their own submit or continue action. */
  onValidityChange?: (isValid: boolean) => void;
}

export const TextField = ({
  label,
  hint,
  error,
  validate,
  validateOn = 'blur',
  onValidityChange,
  id,
  className,
  'aria-describedby': ariaDescribedBy,
  onChange,
  onBlur,
  ...inputProps
}: TextFieldProps) => {
  const generatedId = useId();
  const inputId = id ?? `text-field-${generatedId}`;
  const [hasBlurred, setHasBlurred] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(
    String(inputProps.defaultValue ?? ''),
  );

  const value =
    inputProps.value !== undefined
      ? String(inputProps.value)
      : uncontrolledValue;

  // Empty is left to `required`, so a format message waits for actual input.
  const validationError =
    validate && value.trim()
      ? resolveValidationRule(validate)(value)
      : undefined;

  const resolvedError =
    error ??
    (validateOn === 'change' || hasBlurred ? validationError : undefined);

  const isValid = !error && !validationError;
  const reportValidity = useRef(onValidityChange);
  reportValidity.current = onValidityChange;

  useEffect(() => {
    reportValidity.current?.(isValid);
  }, [isValid]);

  const messageId = hint || resolvedError ? `${inputId}-message` : undefined;
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
        aria-invalid={resolvedError ? true : inputProps['aria-invalid']}
        onChange={(event) => {
          if (inputProps.value === undefined) {
            setUncontrolledValue(event.target.value);
          }
          onChange?.(event);
        }}
        onBlur={(event) => {
          setHasBlurred(true);
          onBlur?.(event);
        }}
      />
      {(resolvedError || hint) && (
        <p
          id={messageId}
          className={resolvedError ? 'text-field__error' : 'text-field__hint'}
        >
          {resolvedError ?? hint}
        </p>
      )}
    </div>
  );
};
