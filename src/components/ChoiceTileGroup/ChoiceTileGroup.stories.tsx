import { useId, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
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
  const instanceId = useId();
  const [value, setValue] = useState(props.value);

  return (
    <ChoiceTileGroup
      {...props}
      name={`${props.name ?? 'example-choice-tile-group'}-${instanceId}`}
      value={value}
      onValueChange={(nextValue) => {
        setValue(nextValue);
        props.onValueChange(nextValue);
      }}
    />
  );
};

const meta = {
  title: 'Patterns/ChoiceTileGroup',
  component: ChoiceTileGroup,
  tags: ['autodocs'],
  args: {
    legend: 'How would you like to get started?',
    hint: 'Choose one option.',
    options,
    value: 'guided',
    onValueChange: () => undefined,
  },
  render: (args) => (
    <StatefulChoiceTileGroup key={args.value ?? 'no-selection'} {...args} />
  ),
} satisfies Meta<typeof ChoiceTileGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const quick = canvas.getByRole('radio', { name: /Quick setup/ });
    const guided = canvas.getByRole('radio', { name: /Guided setup/ });

    await expect(guided).toBeChecked();
    await expect(quick).toHaveAccessibleDescription('Ready in minutes.');
    await userEvent.click(canvas.getByText('Quick setup'));
    await expect(quick).toBeChecked();
    await expect(guided).not.toBeChecked();
    quick.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(guided).toBeChecked();
    await expect(guided).toHaveFocus();
  },
};

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const expert = canvas.getByRole('radio', { name: /Expert setup/ });

    await expect(expert).toBeDisabled();
    await userEvent.click(canvas.getByText('Expert setup'));
    await expect(expert).not.toBeChecked();
    await expect(
      canvas.getByRole('radio', { name: /Guided setup/ }),
    ).toBeChecked();
  },
};
