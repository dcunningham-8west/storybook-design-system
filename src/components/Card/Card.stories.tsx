import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

// Meta configuration tells Storybook where to put it in the sidebar
const meta: Meta<typeof Card> = {
  // 'New Components/' groups it under that label in the sidebar
  title: 'New Components/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

// 1. Default State
export const Default: Story = {
  args: {
    title: 'Standard Card',
    description: 'This is a standard card loaded from a local tsx file.',
    tag: 'Feature',
    isHighlighted: false,
  },
};

// 2. Highlighted State
export const Highlighted: Story = {
  args: {
    title: 'Highlighted Card',
    description: 'This card has the highlighted property set to true.',
    tag: 'Special',
    isHighlighted: true,
  },
};

// 3. Diarm's State
export const Diarm: Story = {
  args: {
    title: 'Diarm Card',
    description: 'This is a diarm card loaded from a local tsx file.',
    tag: 'Diarmiesta',
    isHighlighted: false,
  },
};