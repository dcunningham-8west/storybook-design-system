import type { Meta, StoryObj } from '@storybook/react-vite';
import { WizardButton } from './WizardButton';

const meta = {
  title: 'Components/WizardButton',
  component: WizardButton,
  tags: ['autodocs'],
} satisfies Meta<typeof WizardButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Continue' },
};

export const Disabled: Story = {
  args: { label: 'Continue', disabled: true },
};
