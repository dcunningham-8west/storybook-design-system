import type { Meta, StoryObj } from '@storybook/react-vite';
import { CTAButton } from './CTAButton';

const meta = {
  title: 'Compontents/CTAButton',
  component: CTAButton,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select' },
  },
} satisfies Meta<typeof CTAButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Learn More',
    size: 'small',
    isSecondary: false,
  },
};

export const PrimarytMedium: Story = {
  args: {
    label: 'Learn More',
    size: 'medium',
    isSecondary: false,
  },
};

export const PrimaryLarge: Story = {
  args: {
    label: 'Learn More',
    size: 'large',
    isSecondary: false,
  },
};

export const Secondary: Story = {
  args: {
    label: 'Learn More',
    size: 'small',
    isSecondary: true,
  },
};

export const SecondaryMedium: Story = {
  args: {
    label: 'Learn More',
    size: 'medium',
    isSecondary: true,
  },
};

export const SecondaryLarge: Story = {
  args: {
    label: 'Learn More',
    size: 'large',
    isSecondary: true,
  },
};
