import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { RadioGroup, type RadioGroupProps } from './RadioGroup';

const InteractiveRadioGroup = (args: RadioGroupProps) => {
  const [value, setValue] = useState(args.value);

  return (
    <RadioGroup
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
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: {
    legend: 'Which describes you?',
    options: [
      { label: 'Dentist', value: 'dentist' },
      { label: 'Member', value: 'member' },
      { label: 'Facility', value: 'facility' },
    ],
    onValueChange: fn(),
  },
  render: (args) => <InteractiveRadioGroup {...args} />,
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Inline: Story = {
  args: { layout: 'inline' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group')).toHaveClass('radio-group--inline');
    const dentist = canvas.getByRole('radio', { name: 'Dentist' });
    const member = canvas.getByRole('radio', { name: 'Member' });
    await userEvent.click(dentist);
    await userEvent.keyboard('{ArrowRight}');
    await expect(member).toBeChecked();
    await expect(dentist).not.toBeChecked();
  },
};

export const Required: Story = {
  args: { required: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('group', { name: 'Which describes you? (required)' }),
    ).toBeVisible();
    const dentist = canvas.getByRole('radio', { name: 'Dentist' });
    const member = canvas.getByRole('radio', { name: 'Member' });
    await expect(dentist).toBeRequired();
    await userEvent.click(dentist);
    await expect(dentist).toBeChecked();
    await userEvent.keyboard('{ArrowDown}');
    await expect(member).toBeChecked();
    await expect(dentist).not.toBeChecked();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('member');
  },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'member' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const radio of canvas.getAllByRole('radio')) {
      await expect(radio).toBeDisabled();
    }
    await expect(canvas.getByRole('radio', { name: 'Member' })).toBeChecked();
  },
};
