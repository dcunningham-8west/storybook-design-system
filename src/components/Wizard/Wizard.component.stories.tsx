import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup, type RadioOption } from '../RadioGroup/RadioGroup';
import { TextField } from '../TextField/TextField';
import { Wizard, type WizardStep } from './Wizard';

const steps: WizardStep[] = [
  { id: 'workspace-name', label: 'Workspace name' },
  { id: 'workspace-plan', label: 'Plan' },
  { id: 'workspace-review', label: 'Review' },
];

const planOptions: RadioOption[] = [
  { label: 'Starter', value: 'Starter' },
  { label: 'Team', value: 'Team' },
  { label: 'Enterprise', value: 'Enterprise' },
];

const WizardUsageExample = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [workspaceName, setWorkspaceName] = useState('');
  const [plan, setPlan] = useState('Team');
  const [complete, setComplete] = useState(false);

  if (complete) {
    return (
      <section aria-live="polite">
        <h2>Workspace ready</h2>
        <p>
          {workspaceName} is set up with the {plan} plan.
        </p>
      </section>
    );
  }

  return (
    <Wizard
      steps={steps}
      currentStep={currentStep}
      canContinue={currentStep !== 0 || workspaceName.trim().length > 0}
      onBack={() => setCurrentStep((step) => step - 1)}
      onNext={() => setCurrentStep((step) => step + 1)}
      onComplete={() => setComplete(true)}
      completeLabel="Create workspace"
    >
      {currentStep === 0 && (
        <TextField
          label="Workspace name"
          value={workspaceName}
          onChange={(event) => setWorkspaceName(event.target.value)}
          placeholder="e.g. Northstar team"
          required
        />
      )}
      {currentStep === 1 && (
        <RadioGroup
          legend="Choose a plan"
          options={planOptions}
          value={plan}
          onValueChange={setPlan}
        />
      )}
      {currentStep === 2 && (
        <dl>
          <dt>Workspace</dt>
          <dd>{workspaceName}</dd>
          <dt>Plan</dt>
          <dd>{plan}</dd>
        </dl>
      )}
    </Wizard>
  );
};

const meta = {
  title: 'Components/Wizard',
  component: Wizard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'The Wizard provides step progress, focus handling, and Back/Continue/Complete actions. The consuming application controls the active step, validates its data, and supplies the content for each step.',
          '',
          'Wizard renders StepIndicator automatically from the same `steps` and `currentStep` props. Previous steps appear complete, the active step is identified, and future steps remain upcoming; you do not need to render StepIndicator separately. See [StepIndicator](/?path=/docs/components-stepindicator--docs) for standalone use.',
          '',
          '### Compose a wizard',
          '',
          '```tsx',
          'const [currentStep, setCurrentStep] = useState(0);',
          '',
          '<Wizard',
          '  steps={steps}',
          '  currentStep={currentStep}',
          '  canContinue={isCurrentStepValid}',
          '  onBack={() => setCurrentStep((step) => step - 1)}',
          '  onNext={() => setCurrentStep((step) => step + 1)}',
          '  onComplete={submitForm}',
          '>',
          '  {currentStep === 0 && <TextField label="Workspace name" />}',
          '  {currentStep === 1 && <RadioGroup legend="Choose a plan" />}',
          '</Wizard>',
          '```',
          '',
          'Compose the active step from controls such as TextField, RadioGroup, or ChoiceTileGroup. Keep form values, validation rules, and submission behavior in the consuming application.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Wizard>;

export default meta;
type Story = StoryObj;

export const ComposedExample: Story = {
  render: () => <WizardUsageExample />,
};
