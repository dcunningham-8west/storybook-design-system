import type { Meta, StoryObj } from '@storybook/react-vite';
import { CTAButton } from './CTAButton';

const meta = {
  title: 'Compontents/Button',
  component: CTAButton,
  tags: ['autodocs'],
} satisfies Meta<typeof CTAButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Learn More',
    size: 'small',
    isSecondary: false,
  },
};
