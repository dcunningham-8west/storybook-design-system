import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChoiceTileGroup, type ChoiceTileGroupProps } from './ChoiceTileGroup';

const options = [
  { label: 'Quick setup', value: 'quick', description: 'Ready in minutes.' },
  {
    label: 'Guided setup',
    value: 'guided',
    description: 'A little help along the way.',
  },
  {
    label: 'Flexible setup',
    value: 'flexible',
    description: 'More control over each choice.',
  },
  {
    label: 'Expert setup',
    value: 'expert',
    description: 'Every option available.',
  },
];

const StatefulChoiceTileGroup = (props: ChoiceTileGroupProps) => {
  const [value, setValue] = useState(props.value);
  return <ChoiceTileGroup {...props} value={value} onValueChange={setValue} />;
};

const meta = {
  title: 'Components/ChoiceTileGroup',
  component: ChoiceTileGroup,
  tags: ['autodocs'],
  args: {
    legend: 'How would you like to get started?',
    hint: 'Choose one option.',
    options,
    value: 'guided',
    onValueChange: () => undefined,
  },
  render: (args) => <StatefulChoiceTileGroup {...args} />,
} satisfies Meta<typeof ChoiceTileGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoSelection: Story = {
  args: {
    value: undefined,
  },
};

export const WithDisabledOption: Story = {
  args: {
    options: options.map((option, index) => ({
      ...option,
      disabled: index === 3,
    })),
  },
};
