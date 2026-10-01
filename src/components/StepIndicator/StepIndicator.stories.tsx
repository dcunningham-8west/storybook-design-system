import type { Meta, StoryObj } from '@storybook/react-vite';
import { StepIndicator } from './StepIndicator';

const threeSteps = [
  { id: 'details', label: 'Details' },
  { id: 'configuration', label: 'Configuration' },
  { id: 'review', label: 'Review' },
];

const meta = {
  title: 'Components/StepIndicator',
  component: StepIndicator,
  tags: ['autodocs'],
  args: {
    steps: threeSteps,
    currentStep: 1,
  },
  argTypes: {
    currentStep: {
      control: { type: 'number', min: 0, max: 2 },
      description: 'Zero-based index of the active step.',
    },
  },
} satisfies Meta<typeof StepIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CurrentStep: Story = {};

export const FirstStep: Story = {
  args: {
    currentStep: 0,
  },
};

export const FourSteps: Story = {
  args: {
    steps: [
      { id: 'goal', label: 'Your goal' },
      { id: 'team', label: 'Your team' },
      { id: 'priority', label: 'Your priority' },
      { id: 'support', label: 'Your support' },
    ],
    currentStep: 2,
  },
  argTypes: {
    currentStep: {
      control: { type: 'number', min: 0, max: 3 },
    },
  },
};
