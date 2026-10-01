import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChoiceTileGroup,
  type ChoiceTileOption,
} from '../../components/ChoiceTileGroup/ChoiceTileGroup';
import { TextField } from '../../components/TextField/TextField';
import { Wizard, type WizardStep } from '../../components/Wizard/Wizard';
import './shop-for-dental-plan.css';

interface ChoicePanel extends WizardStep {
  kind: 'choice';
  options: readonly ChoiceTileOption[];
}

interface PanelField {
  id: string;
  label: string;
}

interface FieldPanel extends WizardStep {
  kind: 'fields';
  fields: readonly PanelField[];
}

type Panel = ChoicePanel | FieldPanel;

const panels: Panel[] = [
  {
    kind: 'choice',
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
  {
    kind: 'fields',
    id: 'personal-information',
    label: 'Personal Information',
    fields: [
      { id: 'streetAddress', label: 'Street Address' },
      { id: 'firstName', label: 'First Name' },
      { id: 'lastName', label: 'Last Name' },
      { id: 'birthday', label: 'Birthday (mm/dd/yyyy)' },
    ],
  },
];

const ShopForDentalPlan = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const panel = panels[currentStep];

  const setAnswer = (id: string, value: string) => {
    setAnswers((current) => ({ ...current, [id]: value }));
  };

  const canContinue =
    panel.kind === 'choice'
      ? Boolean(answers[panel.id])
      : panel.fields.every((field) => Boolean(answers[field.id]?.trim()));

  return (
    <main className="shop-dental-plan">
      <Wizard
        steps={panels}
        currentStep={currentStep}
        canContinue={canContinue}
        onBack={() => setCurrentStep((step) => step - 1)}
        onNext={() => setCurrentStep((step) => step + 1)}
        onComplete={() => undefined}
        backLabel="PREVIOUS"
        nextLabel="NEXT"
        completeLabel="NEXT"
      >
        {panel.kind === 'choice' ? (
          <ChoiceTileGroup
            legend={panel.label}
            name={panel.id}
            options={panel.options}
            value={answers[panel.id]}
            onValueChange={(value) => setAnswer(panel.id, value)}
          />
        ) : (
          <div className="shop-dental-plan__fields">
            {panel.fields.map((field) => (
              <TextField
                key={field.id}
                label={field.label}
                placeholder={field.label}
                value={answers[field.id] ?? ''}
                onChange={(event) => setAnswer(field.id, event.target.value)}
              />
            ))}
          </div>
        )}
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
          'A shopping wizard for dental plans, composed from Wizard, ChoiceTileGroup, TextField and CTAButton. Panel 1 captures whether the shopper is a subscriber or a dependent; panel 2 collects their personal information.',
      },
    },
  },
} satisfies Meta<typeof ShopForDentalPlan>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
