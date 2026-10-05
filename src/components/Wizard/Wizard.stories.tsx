import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChoiceTileGroup,
  type ChoiceTileOption,
} from '../ChoiceTileGroup/ChoiceTileGroup';
import { TextField } from '../TextField/TextField';
import { Wizard, type WizardStep } from './Wizard';
import './Wizard.stories.css';

const steps: WizardStep[] = [
  {
    id: 'product-details',
    label: 'Product details',
    description: 'Give the product a clear name and a contact for updates.',
  },
  {
    id: 'configuration',
    label: 'Configuration',
    description: 'Choose the default experience for this product.',
  },
  {
    id: 'review',
    label: 'Review',
    description: 'Confirm these details before creating the product.',
  },
];

const planOptions: ChoiceTileOption[] = [
  { label: 'Starter', value: 'Starter', description: 'For small teams.' },
  {
    label: 'Standard',
    value: 'Standard',
    description: 'For growing products.',
  },
  {
    label: 'Enterprise',
    value: 'Enterprise',
    description: 'For complex organisations.',
  },
];

const ProductWizardExample = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('Standard');
  const [complete, setComplete] = useState(false);

  const nameError =
    name.length > 0 && name.trim().length < 3
      ? 'Product name must contain at least 3 characters.'
      : undefined;
  const emailError =
    email.length > 0 && !email.includes('@')
      ? 'Enter an email address containing @.'
      : undefined;
  const canContinue =
    currentStep !== 0 ||
    (name.trim().length >= 3 && email.includes('@') && !emailError);

  if (complete) {
    return (
      <main className="product-wizard-story">
        <section className="product-wizard-story__success" aria-live="polite">
          <h2>Product created</h2>
          <p>{name} is ready to configure further.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="product-wizard-story">
      <Wizard
        steps={steps}
        currentStep={currentStep}
        canContinue={canContinue}
        onBack={() => setCurrentStep((step) => step - 1)}
        onNext={() => setCurrentStep((step) => step + 1)}
        onComplete={() => setComplete(true)}
        completeLabel="Create product"
      >
        {currentStep === 0 && (
          <div className="product-wizard-story__fields">
            <TextField
              label="Product name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Customer portal"
              hint="Use a name your customers will recognise."
              error={nameError}
              required
            />
            <TextField
              label="Owner email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="owner@example.com"
              error={emailError}
              required
            />
          </div>
        )}

        {currentStep === 1 && (
          <ChoiceTileGroup
            legend="Default plan"
            name="default-plan"
            options={planOptions}
            value={plan}
            onValueChange={setPlan}
            hint="The plan can be changed later."
          />
        )}

        {currentStep === 2 && (
          <dl className="product-wizard-story__review">
            <dt>Product name</dt>
            <dd>{name}</dd>
            <dt>Owner</dt>
            <dd>{email}</dd>
            <dt>Default plan</dt>
            <dd>{plan}</dd>
          </dl>
        )}
      </Wizard>
    </main>
  );
};

const meta = {
  title: 'Patterns/Product Wizard',
  component: ProductWizardExample,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A complete product-setup pattern composed from Wizard, TextField, and ChoiceTileGroup. Wizard renders StepIndicator automatically, showing completed, current, and upcoming steps based on `steps` and `currentStep`; the application does not need to add it separately. The consuming application owns product data, field validation, and submission behavior.',
      },
    },
  },
} satisfies Meta<typeof ProductWizardExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
