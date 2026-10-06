import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  CommunicationConsent,
  type CommunicationConsentProps,
} from './CommunicationConsent';

const InteractiveConsent = (args: CommunicationConsentProps) => {
  const [value, setValue] = useState(args.value);
  useEffect(() => setValue(args.value), [args.value]);

  return (
    <CommunicationConsent
      {...args}
      value={value}
      onValueChange={(selection) => {
        setValue(selection);
        args.onValueChange(selection);
      }}
    />
  );
};

const meta = {
  title: 'Components/CommunicationConsent',
  component: CommunicationConsent,
  tags: ['autodocs'],
  args: {
    label: 'Email consent',
    description: 'to receive email notifications about my dental coverage.',
    onValueChange: fn(),
  },
  argTypes: { value: { control: 'boolean' } },
  render: (args) => <InteractiveConsent {...args} />,
} satisfies Meta<typeof CommunicationConsent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play:
    import.meta.env.MODE === 'test'
      ? async ({ canvasElement, args }) => {
          const canvas = within(canvasElement);
          await expect(
            canvas.getByRole('group', { name: 'Email consent' }),
          ).toBeVisible();
          const agree = canvas.getByRole('radio', { name: 'I Agree' });
          const decline = canvas.getByRole('radio', { name: 'I Decline' });
          await expect(agree).not.toBeChecked();
          await expect(decline).not.toBeChecked();
          await userEvent.click(agree);
          await expect(agree).toBeChecked();
          await expect(args.onValueChange).toHaveBeenLastCalledWith(true);
          await userEvent.keyboard('{ArrowRight}');
          await expect(decline).toBeChecked();
          await expect(agree).not.toBeChecked();
          await expect(args.onValueChange).toHaveBeenLastCalledWith(false);
        }
      : undefined,
};

export const Agreed: Story = { args: { value: true } };
export const Declined: Story = { args: { value: false } };
