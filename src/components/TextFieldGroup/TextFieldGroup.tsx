import type { ReactNode } from 'react';
import './text-field-group.css';

export interface TextFieldGroupProps {
  title: string;
  children: ReactNode;
}

export const TextFieldGroup = ({ title, children }: TextFieldGroupProps) => (
  <fieldset className="text-field-group">
    <legend className="text-field-group__title">{title}</legend>
    <div className="text-field-group__fields">{children}</div>
  </fieldset>
);
