import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup, type RadioGroupProps } from './RadioGroup';

const planOptions = [
  { label: 'Starter', value: 'starter', description: 'For small teams.' },
  {
    label: 'Standard',
    value: 'standard',
    description: 'For growing products.',
  },
  {
    label: 'Enterprise',
    value: 'enterprise',
    description: 'For complex organisations.',
  },
];

const StatefulRadioGroup = (props: RadioGroupProps) => {
  const [value, setValue] = useState(props.value);
  return <RadioGroup {...props} value={value} onValueChange={setValue} />;
};

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: {
    legend: 'Default plan',
    options: planOptions,
    value: 'standard',
    onValueChange: () => undefined,
  },
  render: (args) => <StatefulRadioGroup {...args} />,
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: {
    hint: 'The plan can be changed later.',
  },
};

export const WithError: Story = {
  args: {
    value: '',
    error: 'Choose a default plan.',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
