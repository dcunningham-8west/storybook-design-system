import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChoiceTileGroup,
  type ChoiceTileOption,
} from '../../components/ChoiceTileGroup/ChoiceTileGroup';
import { CTAButton } from '../../components/CTAButton/CTAButton';
import { Wizard, type WizardStep } from '../../components/Wizard/Wizard';
import './product-recommendation-quiz.css';

type Profile = 'simple' | 'collaborative' | 'analytical' | 'enterprise';

interface Question extends WizardStep {
  prompt: string;
  options: readonly ChoiceTileOption[];
}

interface ProductRecommendation {
  title: string;
  description: string;
  tag: string;
}

const questions: Question[] = [
  {
    id: 'goal',
    label: 'Your goal',
    description: 'Start with the outcome that matters most to you.',
    prompt: 'What would you most like to improve?',
    options: [
      {
        label: 'Get started quickly',
        value: 'simple',
        description: 'Reduce setup time and complexity.',
      },
      {
        label: 'Work better together',
        value: 'collaborative',
        description: 'Keep teams aligned and connected.',
      },
      {
        label: 'Understand performance',
        value: 'analytical',
        description: 'Turn activity into useful insight.',
      },
      {
        label: 'Strengthen governance',
        value: 'enterprise',
        description: 'Add oversight, security and control.',
      },
    ],
  },
  {
    id: 'team',
    label: 'Your team',
    description: 'Tell us about the people who will use the product.',
    prompt: 'Which team setup sounds most like yours?',
    options: [
      { label: 'Just me', value: 'simple', description: 'One person.' },
      {
        label: 'Small team',
        value: 'collaborative',
        description: 'Two to ten people.',
      },
      {
        label: 'Specialist team',
        value: 'analytical',
        description: 'Focused roles and workflows.',
      },
      {
        label: 'Large organisation',
        value: 'enterprise',
        description: 'Multiple teams and departments.',
      },
    ],
  },
  {
    id: 'priority',
    label: 'Your priority',
    description: 'Choose the capability you value most.',
    prompt: 'What matters most day to day?',
    options: [
      {
        label: 'Ease of use',
        value: 'simple',
        description: 'Clear workflows with little training.',
      },
      {
        label: 'Communication',
        value: 'collaborative',
        description: 'Fast feedback and shared context.',
      },
      {
        label: 'Reporting',
        value: 'analytical',
        description: 'Detailed trends and measurements.',
      },
      {
        label: 'Administration',
        value: 'enterprise',
        description: 'Permissions, policies and auditability.',
      },
    ],
  },
  {
    id: 'support',
    label: 'Your support',
    description: 'Choose how you prefer to adopt new tools.',
    prompt: 'What level of support works best?',
    options: [
      {
        label: 'Self-service',
        value: 'simple',
        description: 'Documentation when I need it.',
      },
      {
        label: 'Community-led',
        value: 'collaborative',
        description: 'Learn alongside other users.',
      },
      {
        label: 'Expert guidance',
        value: 'analytical',
        description: 'Specialist help with optimisation.',
      },
      {
        label: 'Dedicated support',
        value: 'enterprise',
        description: 'A managed service and named contact.',
      },
    ],
  },
];

const recommendations: Record<Profile, readonly ProductRecommendation[]> = {
  simple: [
    {
      title: 'Launchpad',
      description: 'A focused starter workspace with guided setup.',
      tag: 'Best match',
    },
    {
      title: 'QuickStart Templates',
      description: 'Ready-made workflows for common tasks.',
      tag: 'Add-on',
    },
  ],
  collaborative: [
    {
      title: 'Teamspace',
      description: 'Shared planning, updates and team decisions.',
      tag: 'Best match',
    },
    {
      title: 'Connect',
      description: 'Conversations and notifications in one place.',
      tag: 'Add-on',
    },
  ],
  analytical: [
    {
      title: 'Insights Pro',
      description: 'Advanced reporting with custom dashboards.',
      tag: 'Best match',
    },
    {
      title: 'Forecast',
      description: 'Planning tools powered by historical trends.',
      tag: 'Add-on',
    },
  ],
  enterprise: [
    {
      title: 'Control Centre',
      description: 'Organisation-wide policy and access management.',
      tag: 'Best match',
    },
    {
      title: 'Governance Hub',
      description: 'Audit trails, retention and compliance controls.',
      tag: 'Add-on',
    },
  ],
};

const findProfile = (answers: Record<string, string>): Profile => {
  const scores: Record<Profile, number> = {
    simple: 0,
    collaborative: 0,
    analytical: 0,
    enterprise: 0,
  };

  Object.values(answers).forEach((answer) => {
    scores[answer as Profile] += 1;
  });

  return (Object.entries(scores) as [Profile, number][]).reduce(
    (best, candidate) => (candidate[1] > best[1] ? candidate : best),
  )[0];
};

const ProductRecommendationQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const question = questions[currentStep];
  const selectedAnswer = answers[question.id];

  const chooseAnswer = (value: string) => {
    setAnswers((current) => ({ ...current, [question.id]: value }));
  };

  const restart = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowResults(false);
  };

  if (showResults) {
    const profile = findProfile(answers);
    const products = recommendations[profile];

    return (
      <main className="recommendation-quiz">
        <section className="recommendation-quiz__results" aria-live="polite">
          <p className="recommendation-quiz__eyebrow">Your recommendations</p>
          <h2>A product collection selected for you</h2>
          <p className="recommendation-quiz__intro">
            Based on your answers, these products are the strongest fit.
          </p>
          <div className="recommendation-quiz__products">
            {products.map((product, index) => (
              <div>
                {product.title} {String(index)}
              </div>
            ))}
          </div>
          <CTAButton label="Start again" isSecondary onClick={restart} />
        </section>
      </main>
    );
  }

  return (
    <main className="recommendation-quiz">
      <Wizard
        steps={questions}
        currentStep={currentStep}
        canContinue={Boolean(selectedAnswer)}
        onBack={() => setCurrentStep((step) => step - 1)}
        onNext={() => setCurrentStep((step) => step + 1)}
        onComplete={() => setShowResults(true)}
        completeLabel="See recommendations"
      >
        <ChoiceTileGroup
          legend={question.prompt}
          name={question.id}
          options={question.options}
          value={selectedAnswer}
          onValueChange={chooseAnswer}
          hint="Choose one answer to continue."
        />
      </Wizard>
    </main>
  );
};

// Survives minification so docs "Show code" renders the name, not <f />.
ProductRecommendationQuiz.displayName = 'ProductRecommendationQuiz';

const meta = {
  title: 'Patterns/Product Recommendation Quiz',
  component: ProductRecommendationQuiz,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A four-question recommendation pattern composed from Wizard, ChoiceTileGroup and CTAButton. The story owns the questions, answers and matching rules.',
      },
    },
  },
} satisfies Meta<typeof ProductRecommendationQuiz>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
