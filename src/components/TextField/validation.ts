export type ValidationRule = (value: string) => string | undefined;

const birthday: ValidationRule = (value) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());

  if (!match) {
    return 'Enter your birthday as mm/dd/yyyy.';
  }

  const [, month, day, year] = match.map(Number);
  const date = new Date(year, month - 1, day);
  const isRealDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!isRealDate) {
    return 'Enter a real calendar date.';
  }

  if (date > new Date()) {
    return 'Birthday cannot be in the future.';
  }

  return undefined;
};

/** Named rules selectable via the TextField `validate` prop. */
export const validationRules = { birthday } satisfies Record<
  string,
  ValidationRule
>;

export type ValidationRuleName = keyof typeof validationRules;

export const resolveValidationRule = (
  rule: ValidationRuleName | ValidationRule,
): ValidationRule =>
  typeof rule === 'function' ? rule : validationRules[rule];
