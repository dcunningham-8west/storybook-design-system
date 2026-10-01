import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChoiceTileGroup,
  type ChoiceTileOption,
} from '../../components/ChoiceTileGroup/ChoiceTileGroup';
import { Wizard, type WizardStep } from '../../components/Wizard/Wizard';
import './shop-for-dental-plan.css';

interface Panel extends WizardStep {
  options: readonly ChoiceTileOption[];
}

const panels: Panel[] = [
  {
    id: 'role',
    label: 'Which Describes You?',
    options: [
      {
        label: 'Subscriber',
        value: 'subscriber',
        description:
          'You purchased an Individual & Family plan at DeltaDentalCoversMe.com',
      },
      {
        label: 'Dependent',
        value: 'dependent',
        description:
          "You are a spouse, partner, or child under a subscriber's plan",
      },
    ],
  },
];

const ShopForDentalPlan = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const panel = panels[currentStep];
  const selectedAnswer = answers[panel.id];

  const chooseAnswer = (value: string) => {
    setAnswers((current) => ({ ...current, [panel.id]: value }));
  };

  return (
    <main className="shop-dental-plan">
      <Wizard
        steps={panels}
        currentStep={currentStep}
        canContinue={Boolean(selectedAnswer)}
        onBack={() => setCurrentStep((step) => step - 1)}
        onNext={() => setCurrentStep((step) => step + 1)}
        onComplete={() => setCurrentStep((step) => step + 1)}
        nextLabel="NEXT"
        completeLabel="NEXT"
      >
        <ChoiceTileGroup
          legend={panel.label}
          name={panel.id}
          options={panel.options}
          value={selectedAnswer}
          onValueChange={chooseAnswer}
        />
      </Wizard>
    </main>
  );
};

const meta = {
  title: 'Patterns/Shop For A Dental Plan',
  component: ShopForDentalPlan,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A shopping wizard for dental plans, composed from Wizard, ChoiceTileGroup and CTAButton. Panel 1 captures whether the shopper is a subscriber or a dependent.',
      },
    },
  },
} satisfies Meta<typeof ShopForDentalPlan>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
