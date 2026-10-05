import { useId, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ChoiceTile, type ChoiceTileProps } from './ChoiceTile';

const InteractiveChoiceTile = (args: ChoiceTileProps) => {
  const instanceId = useId();
  const [checked, setChecked] = useState(args.checked);

  return (
    <ChoiceTile
      {...args}
      name={`${args.name ?? 'example-choice-tile'}-${instanceId}`}
      checked={checked}
      onChange={(event) => {
        setChecked(event.target.checked);
        args.onChange?.(event);
      }}
    />
  );
};

const meta = {
  title: 'Components/ChoiceTile',
  component: ChoiceTile,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    name: { control: 'text' },
    value: { control: 'text' },
    defaultChecked: { table: { disable: true } },
  },
  args: {
    label: 'Guided setup',
    description: 'A little help along the way.',
    name: 'example-choice-tile',
    value: 'guided',
    checked: false,
    disabled: false,
    onChange: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<ChoiceTileProps>();

    return (
      <InteractiveChoiceTile
        key={String(args.checked)}
        {...args}
        onChange={(event) => {
          args.onChange?.(event);
          updateArgs({ checked: event.target.checked });
        }}
      />
    );
  },
} satisfies Meta<typeof ChoiceTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('radio')).toHaveLength(1);
    const radio = canvas.getByRole('radio', { name: /Guided setup/ });
    await expect(radio).not.toBeChecked();
    await expect(radio).toHaveAccessibleDescription(
      'A little help along the way.',
    );
  },
};

export const Checked: Story = {
  args: { checked: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('radio')).toBeChecked();
  },
};

export const WithoutDescription: Story = {
  args: { description: undefined },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('radio')).not.toHaveAttribute(
      'aria-describedby',
    );
  },
};

export const ClickSelection: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const radio = canvas.getByRole('radio');
    await expect(radio).not.toBeChecked();
    await userEvent.click(canvas.getByText('Guided setup'));
    await waitFor(() => expect(radio).toBeChecked());
    await expect(args.onChange).toHaveBeenCalledOnce();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const radio = canvas.getByRole('radio');
    await expect(radio).toBeDisabled();
    await userEvent.click(canvas.getByText('Guided setup'));
    await expect(radio).not.toBeChecked();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true },
  play: async ({ canvasElement }) => {
    const radio = within(canvasElement).getByRole('radio');
    await expect(radio).toBeDisabled();
    await expect(radio).toBeChecked();
  },
};
