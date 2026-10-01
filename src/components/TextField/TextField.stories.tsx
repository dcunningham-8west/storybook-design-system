import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from './TextField';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: {
    label: 'Product name',
    placeholder: 'e.g. Customer portal',
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: {
    hint: 'Use a name your customers will recognise.',
  },
};

export const WithError: Story = {
  args: {
    defaultValue: 'CP',
    error: 'Product name must contain at least 3 characters.',
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: 'Customer portal',
    disabled: true,
  },
};
