import { useEffect, useId, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Radio, type RadioProps } from './Radio';

const InteractiveRadio = (args: RadioProps) => {
  const instanceId = useId();
  const [checked, setChecked] = useState(args.checked);

  useEffect(() => {
    setChecked(args.checked);
  }, [args.checked]);

  return (
    <Radio
      {...args}
      name={`${args.name ?? 'example-radio'}-${instanceId}`}
      checked={checked}
      onChange={(event) => {
        setChecked(event.target.checked);
        args.onChange?.(event);
      }}
    />
  );
};

const meta = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    defaultChecked: { table: { disable: true } },
  },
  args: {
    'aria-label': 'Select option',
    name: 'example-radio',
    value: 'option',
    checked: false,
    disabled: false,
    onChange: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<RadioProps>();

    return (
      <InteractiveRadio
        {...args}
        onChange={(event) => {
          args.onChange?.(event);
          updateArgs({ checked: event.target.checked });
        }}
      />
    );
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const radio = within(canvasElement).getByRole('radio', {
      name: 'Select option',
    });

    await expect(radio).not.toBeChecked();
    await expect(radio).toBeEnabled();
  },
};

export const Checked: Story = {
  args: { checked: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('radio')).toBeChecked();
  },
};

export const ClickSelection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'An interaction test, not a separate visual variant. It starts unchecked, clicks the radio, and verifies selection and the change callback.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const radio = within(canvasElement).getByRole('radio', {
      name: 'Select option',
    });

    await expect(radio).not.toBeChecked();
    await userEvent.click(radio);
    await waitFor(() => expect(radio).toBeChecked());
    await expect(args.onChange).toHaveBeenCalledOnce();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const radio = within(canvasElement).getByRole('radio');

    await expect(radio).toBeDisabled();
    await expect(radio).not.toBeChecked();
    await userEvent.click(radio);
    await expect(radio).not.toBeChecked();
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
