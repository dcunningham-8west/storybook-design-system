import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    title: 'Teamspace',
    description: 'Shared planning and updates for growing teams.',
    tag: 'Product',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Highlighted: Story = {
  args: {
    isHighlighted: true,
    tag: 'Best match',
  },
};
