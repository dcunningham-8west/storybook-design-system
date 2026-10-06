import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, mocked, userEvent, within } from 'storybook/test';
import { Registration } from './Registration';

const meta = {
  title: 'Patterns/Registration',
  component: Registration,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A branching registration wizard composed from Wizard, RadioGroup, StepIndicator, TextField, TextFieldGroup, CommunicationConsent, and WizardButton. Provider and subscriber routes proceed from details to account setup, then Success. The facility route has dedicated facility details, a provider-details registration step, and provider-style success. Register user awaits onRegister or onSubscriberRegister; rejected callbacks stay on the form with a retry message. With no callback, Storybook simulates success without creating an account or sending email. Provider Success uses the entered email for verification; direct previews use the supplied sample address. Proceed to Sign In calls onProceedToSignIn with the route; the consuming app owns sign-in navigation. Password confirmation is excluded from submission and account fields are cleared after success. Provider Mobile Number is optional; Subscriber Mobile Number is required. Consent is optional, independent, and unselected. No credentials are logged in Canvas. Earlier steps preserve route-specific values. Direct panel stories skip preceding panels for preview only. Interaction scripts run only in test mode.',
      },
    },
  },
  args: {
    onNext: fn(),
    onRegister: import.meta.env.MODE === 'test' ? fn() : undefined,
    onSubscriberRegister: import.meta.env.MODE === 'test' ? fn() : undefined,
    onProceedToSignIn: fn(),
  },
} satisfies Meta<typeof Registration>;

export default meta;
type Story = StoryObj<typeof meta>;

const testOnly = (play: NonNullable<Story['play']>): Story['play'] =>
  import.meta.env.MODE === 'test' ? play : undefined;

export const Step1: Story = {
  name: 'Step 1',
  play: testOnly(async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { name: 'Registration - step 1 of 4' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('group', { name: 'Which describes you? (required)' }),
    ).toBeVisible();
    const radios = canvas.getAllByRole('radio');
    await expect(radios).toHaveLength(3);
    for (const radio of radios) {
      await expect(radio).not.toBeChecked();
      await expect(radio).toBeRequired();
    }
    const next = canvas.getByRole('button', { name: 'Next' });
    const content = canvasElement.querySelector('.wizard__content');
    await expect(content).toContainElement(next);
    await expect(content).toContainElement(
      canvas.getByRole('group', { name: 'Which describes you? (required)' }),
    );
    await expect(content).not.toContainElement(
      canvas.getByRole('heading', { name: 'Registration - step 1 of 4' }),
    );
    await expect(next).toBeDisabled();
    await userEvent.click(next);
    await expect(args.onNext).not.toHaveBeenCalled();

    const dentist = canvas.getByRole('radio', {
      name: 'I am either a dentist or associated with a dentist.',
    });
    await userEvent.click(dentist);
    await expect(dentist).toBeChecked();
    await expect(next).toBeEnabled();
    await userEvent.click(next);
    await expect(args.onNext).toHaveBeenLastCalledWith('dentist');
    await expect(
      canvas.getByRole('heading', { name: 'Registration - step 2 of 4' }),
    ).toHaveFocus();
    await expect(canvas.getAllByRole('textbox')).toHaveLength(9);
    await userEvent.click(canvas.getByRole('button', { name: 'Back' }));

    await userEvent.click(
      canvas.getByRole('radio', {
        name: 'I am a member or adult dependent and have coverage with Delta Dental.',
      }),
    );
    await expect(
      canvas.getByRole('radio', {
        name: 'I am either a dentist or associated with a dentist.',
      }),
    ).not.toBeChecked();
    await expect(
      canvas.getByRole('heading', { name: 'Registration - step 1 of 4' }),
    ).toBeVisible();
    await expect(args.onNext).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await expect(args.onNext).toHaveBeenLastCalledWith('member');
    await expect(
      canvas.getByRole('heading', { name: 'Registration - step 2 of 4' }),
    ).toHaveFocus();
    await expect(canvasElement.querySelector('.registration')).toHaveAttribute(
      'data-registration-route',
      'subscriber',
    );
    await expect(
      canvas.getByRole('group', { name: 'Subscriber Details' }),
    ).toBeVisible();
    await expect(canvas.getAllByRole('textbox')).toHaveLength(8);
    await expect(canvas.getByRole('button', { name: 'Next' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Back' }));
    const member = canvas.getByRole('radio', {
      name: 'I am a member or adult dependent and have coverage with Delta Dental.',
    });
    await expect(member).toBeChecked();
    await userEvent.click(member);
    await userEvent.keyboard('{ArrowDown}');
    await expect(
      canvas.getByRole('radio', { name: 'I am a DeltaCare\u00ae facility.' }),
    ).toBeChecked();
    await expect(canvas.getByRole('button', { name: 'Next' })).toBeEnabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await expect(args.onNext).toHaveBeenLastCalledWith('facility');
    await expect(
      canvas.getByRole('heading', { name: 'Facility Registration' }),
    ).toHaveFocus();
    await expect(canvasElement.querySelector('.registration')).toHaveAttribute(
      'data-registration-route',
      'facility',
    );
    await expect(
      canvas.getByRole('navigation', {
        name: 'Facility registration progress',
      }),
    ).toContainElement(canvas.getByText('Enter Facility Details'));
    const facilityFields = [
      ['First Name', 'Alex'],
      ['Last Name', 'Taylor'],
      ['Taxpayer Identification Number (TIN)', '123456789'],
      ['Facility Name', 'Boston Dental'],
      ['Facility Number', 'A12345'],
      ['Facility Telephone Number', '6175551234'],
    ];
    await expect(canvas.getAllByRole('textbox')).toHaveLength(6);
    for (const [label] of facilityFields) {
      await expect(canvas.getByRole('textbox', { name: label })).toBeRequired();
    }
    const continueButton = canvas.getByRole('button', { name: 'Continue' });
    await expect(continueButton).toBeDisabled();
    for (const [label, value] of facilityFields) {
      await userEvent.type(canvas.getByRole('textbox', { name: label }), value);
    }
    const tin = canvas.getByRole('textbox', {
      name: 'Taxpayer Identification Number (TIN)',
    });
    await userEvent.clear(tin);
    await userEvent.type(tin, '123');
    await expect(continueButton).toBeDisabled();
    await userEvent.clear(tin);
    await userEvent.type(tin, '123456789');
    await expect(continueButton).toBeEnabled();
    await userEvent.click(continueButton);
    await expect(args.onNext).toHaveBeenLastCalledWith('facility', {
      firstName: 'Alex',
      lastName: 'Taylor',
      tin: '123456789',
      facilityName: 'Boston Dental',
      facilityNumber: 'A12345',
      facilityTelephoneNumber: '6175551234',
    });
    await expect(
      canvas.getByRole('heading', { name: 'Complete Registration' }),
    ).toHaveFocus();
    await expect(
      canvas.getByRole('navigation', {
        name: 'Facility registration progress',
      }),
    ).toContainElement(canvas.getByText('Complete Registration'));
    await expect(canvas.getAllByRole('textbox')).toHaveLength(9);
    await expect(
      canvas.getByRole('button', { name: 'Continue' }),
    ).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Back' }));
    await expect(
      canvas.getByRole('heading', { name: 'Facility Registration' }),
    ).toHaveFocus();
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(
      canvas.getByRole('heading', { name: 'Registration - step 1 of 4' }),
    ).toHaveFocus();
    await expect(canvas.getAllByRole('radio')).toHaveLength(3);
    await expect(args.onNext).toHaveBeenCalledTimes(4);
  }),
};

export const Step2: Story = {
  name: 'Step 2 - Provider',
  args: { initialStep: 1, initialRole: 'dentist' },
  play: testOnly(async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { name: 'Registration - step 2 of 4' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('link', { name: 'Contact us' }),
    ).toHaveAttribute(
      'href',
      'https://www.deltadental.com/us/en/about-us/contact-us.html',
    );
    await expect(canvas.getAllByRole('group')).toHaveLength(3);
    const inputs = canvas.getAllByRole('textbox');
    await expect(inputs).toHaveLength(9);
    for (const input of inputs) await expect(input).toBeRequired();
    const next = canvas.getByRole('button', { name: 'Next' });
    await expect(next).toBeDisabled();
    const values = [
      ['First Name:', 'Alex'],
      ['Last Name:', 'Taylor'],
      ['Business Tax ID:', '001234567'],
      ['Business City:', 'Boston'],
      ['Business Postal Code:', '02108'],
      ['Dentist First Name:', 'Jordan'],
      ['Dentist Last Name:', 'Lee'],
      ['License ID:', 'D12345'],
    ];
    for (const [label, value] of values) {
      await userEvent.type(canvas.getByRole('textbox', { name: label }), value);
    }
    await expect(next).toBeDisabled();
    const licenseState = canvas.getByRole('textbox', {
      name: 'License State:',
    });
    await userEvent.type(licenseState, '   ');
    await expect(next).toBeDisabled();
    await userEvent.clear(licenseState);
    await userEvent.type(licenseState, 'MA');
    await expect(next).toBeEnabled();
    await userEvent.click(next);
    await expect(args.onNext).toHaveBeenCalledTimes(1);
    await expect(args.onNext).toHaveBeenLastCalledWith('dentist', {
      firstName: 'Alex',
      lastName: 'Taylor',
      businessTaxId: '001234567',
      businessCity: 'Boston',
      businessPostalCode: '02108',
      dentistFirstName: 'Jordan',
      dentistLastName: 'Lee',
      licenseId: 'D12345',
      licenseState: 'MA',
    });
    await expect(
      canvas.getByRole('heading', { name: 'Registration - step 3 of 4' }),
    ).toHaveFocus();
    await expect(
      canvas.getByRole('button', { name: 'Register user' }),
    ).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Back' }));
    await expect(
      canvas.getByRole('textbox', { name: 'License State:' }),
    ).toHaveValue('MA');
    await userEvent.click(canvas.getByRole('button', { name: 'Back' }));
    await expect(
      canvas.getByRole('radio', {
        name: 'I am either a dentist or associated with a dentist.',
      }),
    ).toBeChecked();
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    for (const [label, value] of [...values, ['License State:', 'MA']]) {
      await expect(canvas.getByRole('textbox', { name: label })).toHaveValue(
        value,
      );
    }
    await expect(canvas.getByRole('button', { name: 'Next' })).toBeEnabled();

    await userEvent.click(canvas.getByRole('button', { name: 'Back' }));
    await userEvent.click(
      canvas.getByRole('radio', {
        name: 'I am a member or adult dependent and have coverage with Delta Dental.',
      }),
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await expect(
      canvas.getByRole('group', { name: 'Subscriber Details' }),
    ).toBeVisible();
    await expect(canvas.getAllByRole('textbox')).toHaveLength(8);
    await expect(
      canvas.getByRole('textbox', { name: 'First Name:' }),
    ).toHaveValue('');
    await expect(canvas.getByRole('button', { name: 'Next' })).toBeDisabled();
    await expect(args.onNext).toHaveBeenLastCalledWith('member');

    await userEvent.click(canvas.getByRole('button', { name: 'Back' }));
    await userEvent.click(
      canvas.getByRole('radio', {
        name: 'I am either a dentist or associated with a dentist.',
      }),
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    for (const [label, value] of [...values, ['License State:', 'MA']]) {
      await expect(canvas.getByRole('textbox', { name: label })).toHaveValue(
        value,
      );
    }
  }),
};

export const Step2Subscriber: Story = {
  name: 'Step 2 - Subscriber',
  args: { initialStep: 1, initialRole: 'member' },
  play: testOnly(async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('group')).toHaveLength(3);
    await expect(canvas.getAllByRole('textbox')).toHaveLength(8);
    await expect(
      canvas.getByText(/Registration of a spouse or adult dependent/),
    ).toBeVisible();
    await expect(
      canvas.getByRole('link', { name: 'Contact us' }),
    ).toHaveAttribute(
      'href',
      'https://www.deltadental.com/us/en/about-us/contact-us.html',
    );
    for (const input of canvas.getAllByRole('textbox')) {
      await expect(input).toBeRequired();
    }
    const next = canvas.getByRole('button', { name: 'Next' });
    await expect(next).toBeDisabled();
    const values = [
      ['First Name:', 'Alex'],
      ['Last Name:', 'Taylor'],
      ['Member ID:', '001234567'],
      ['Zip Code:', '02108'],
      ['Dependent First Name:', 'Jordan'],
      ['Dependent Last Name:', 'Taylor'],
    ];
    for (const [label, value] of values) {
      await userEvent.type(canvas.getByRole('textbox', { name: label }), value);
    }
    const birthday = canvas.getByRole('textbox', {
      name: 'Date of Birth (mm/dd/yyyy)',
    });
    const dependentBirthday = canvas.getByRole('textbox', {
      name: 'Dependent Date of Birth (mm/dd/yyyy)',
    });
    await userEvent.type(birthday, '02/30/1980');
    await userEvent.type(dependentBirthday, '01/01/2999');
    await userEvent.tab();
    await expect(birthday).toHaveAttribute('aria-invalid', 'true');
    await expect(dependentBirthday).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByText('Enter a real calendar date.')).toBeVisible();
    await expect(
      canvas.getByText('Birthday cannot be in the future.'),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole('radio', { name: 'I am the Subscriber' }),
    );
    await expect(next).toBeDisabled();
    await userEvent.clear(birthday);
    await userEvent.type(birthday, '01/15/1980');
    await expect(next).toBeDisabled();
    await userEvent.clear(dependentBirthday);
    await userEvent.type(dependentBirthday, '06/10/2000');
    await userEvent.tab();
    await expect(birthday).not.toHaveAttribute('aria-invalid', 'true');
    await expect(dependentBirthday).not.toHaveAttribute('aria-invalid', 'true');
    await expect(next).toBeEnabled();
    await userEvent.click(
      canvas.getByRole('radio', { name: 'I am a covered dependent' }),
    );
    await expect(
      canvas.getByRole('radio', { name: 'I am the Subscriber' }),
    ).not.toBeChecked();
    await userEvent.click(next);
    await expect(args.onNext).toHaveBeenCalledTimes(1);
    await expect(args.onNext).toHaveBeenLastCalledWith('member', {
      relationship: 'dependent',
      firstName: 'Alex',
      lastName: 'Taylor',
      memberId: '001234567',
      dateOfBirth: '01/15/1980',
      zipCode: '02108',
      dependentFirstName: 'Jordan',
      dependentLastName: 'Taylor',
      dependentDateOfBirth: '06/10/2000',
    });
    await expect(
      canvas.getByRole('heading', {
        name: 'Registration - step 3 of 4',
      }),
    ).toHaveFocus();
    await expect(
      canvas.getByRole('group', { name: 'Email consent' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Register user' }),
    ).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Back' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Back' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await expect(
      canvas.getByRole('radio', { name: 'I am a covered dependent' }),
    ).toBeChecked();
    await expect(
      canvas.getByRole('textbox', { name: 'Member ID:' }),
    ).toHaveValue('001234567');
    await expect(canvas.getByRole('button', { name: 'Next' })).toBeEnabled();
  }),
};

export const Step2Facility: Story = {
  name: 'Step 2 - DeltaCare',
  args: { initialStep: 1, initialRole: 'facility' },
  play: testOnly(async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { name: 'Facility Registration' }),
    ).toBeVisible();
    await expect(canvasElement.querySelector('.registration')).toHaveAttribute(
      'data-registration-route',
      'facility',
    );
    await expect(
      canvas.getByRole('navigation', {
        name: 'Facility registration progress',
      }),
    ).toContainElement(canvas.getByText('Enter Facility Details'));
    await expect(canvas.getAllByRole('textbox')).toHaveLength(6);
    await expect(
      canvas.getByRole('button', { name: 'Continue' }),
    ).toBeDisabled();
  }),
};

export const Step3Facility: Story = {
  name: 'Step 3 - DeltaCare',
  args: { initialStep: 2, initialRole: 'facility' },
  play: testOnly(async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { name: 'Complete Registration' }),
    ).toHaveFocus();
    await expect(
      canvas.getByRole('navigation', {
        name: 'Facility registration progress',
      }),
    ).toContainElement(canvas.getByText('Complete Registration'));
    await expect(canvas.getAllByRole('textbox')).toHaveLength(9);
    const continueButton = canvas.getByRole('button', { name: 'Continue' });
    await expect(continueButton).toBeDisabled();
    const values = [
      ['First Name:', 'Alex'],
      ['Last Name:', 'Taylor'],
      ['Business Tax ID:', '001234567'],
      ['Business City:', 'Boston'],
      ['Business Postal Code:', '02108'],
      ['Dentist First Name:', 'Jordan'],
      ['Dentist Last Name:', 'Lee'],
      ['License ID:', 'D12345'],
      ['License State:', 'MA'],
    ];
    for (const [label, value] of values) {
      await userEvent.type(canvas.getByRole('textbox', { name: label }), value);
    }
    await expect(continueButton).toBeEnabled();
    await userEvent.click(continueButton);
    await expect(args.onNext).toHaveBeenLastCalledWith('facility', {
      firstName: 'Alex',
      lastName: 'Taylor',
      businessTaxId: '001234567',
      businessCity: 'Boston',
      businessPostalCode: '02108',
      dentistFirstName: 'Jordan',
      dentistLastName: 'Lee',
      licenseId: 'D12345',
      licenseState: 'MA',
    });
    await expect(
      canvas.getByRole('heading', { name: 'Success' }),
    ).toHaveFocus();
    await expect(
      canvas.getByText(/code has been sent to tnussbaumer@deltadental.com/),
    ).toBeVisible();
    await expect(
      canvas.getByRole('navigation', {
        name: 'Facility registration progress',
      }),
    ).toContainElement(canvas.getByText('Success'));
    await userEvent.click(
      canvas.getByRole('button', { name: 'Proceed to Sign In' }),
    );
    await expect(args.onProceedToSignIn).toHaveBeenLastCalledWith('facility');
  }),
};

export const Step4Facility: Story = {
  name: 'Step 4 - DeltaCare',
  args: { initialStep: 3, initialRole: 'facility' },
  play: testOnly(async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { name: 'Success' }),
    ).toHaveFocus();
    await expect(
      canvas.queryByRole('heading', { name: 'Registration - step 4 of 4' }),
    ).not.toBeInTheDocument();
    await expect(
      canvas.getByText(/code has been sent to tnussbaumer@deltadental.com/),
    ).toBeVisible();
    await expect(
      canvas.getByRole('navigation', {
        name: 'Facility registration progress',
      }),
    ).toContainElement(canvas.getByText('Success'));
    await userEvent.click(
      canvas.getByRole('button', { name: 'Proceed to Sign In' }),
    );
    await expect(args.onProceedToSignIn).toHaveBeenLastCalledWith('facility');
  }),
};

export const Step3Provider: Story = {
  name: 'Step 3 - Provider',
  args: { initialStep: 2, initialRole: 'dentist' },
  play: testOnly(async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', {
        name: 'Registration - step 3 of 4',
      }),
    ).toBeVisible();
    await expect(canvas.getAllByRole('group')).toHaveLength(3);
    const requiredLabels = [
      'Username:',
      'Password:',
      'Confirm Password:',
      'Email:',
      'Challenge Question:',
      'Challenge Answer:',
    ];
    for (const label of requiredLabels) {
      await expect(
        canvas.getByLabelText(new RegExp(`^${label}`)),
      ).toBeRequired();
      await expect(canvas.getByLabelText(new RegExp(`^${label}`))).toHaveValue(
        '',
      );
    }
    await expect(canvas.getByLabelText('Mobile Number:')).not.toBeRequired();
    const password = canvas.getByLabelText(/^Password:/);
    const confirmation = canvas.getByLabelText(/^Confirm Password:/);
    await expect(password).toHaveAttribute('type', 'password');
    await expect(confirmation).toHaveAttribute('type', 'password');
    const register = canvas.getByRole('button', { name: 'Register user' });
    await expect(register).toBeDisabled();
    await userEvent.type(
      canvas.getByLabelText(/^Username:/),
      'example-provider',
    );
    await userEvent.type(password, 'Example-password-123');
    await userEvent.type(confirmation, 'Different-password');
    await userEvent.type(canvas.getByLabelText(/^Email:/), 'not-an-email');
    await userEvent.type(
      canvas.getByLabelText(/^Challenge Question:/),
      'What was your first school?',
    );
    await userEvent.type(
      canvas.getByLabelText(/^Challenge Answer:/),
      'Example school',
    );
    await userEvent.tab();
    await expect(canvas.getByText('Passwords must match.')).toBeVisible();
    await expect(
      canvas.getByText('Enter a valid email address.'),
    ).toBeVisible();
    await expect(register).toBeDisabled();
    await userEvent.clear(confirmation);
    await userEvent.type(confirmation, 'Example-password-123');
    await expect(register).toBeDisabled();
    await userEvent.clear(canvas.getByLabelText(/^Email:/));
    await userEvent.type(
      canvas.getByLabelText(/^Email:/),
      'provider@example.com',
    );
    await userEvent.tab();
    await expect(register).toBeEnabled();
    if (args.onRegister) {
      mocked(args.onRegister).mockRejectedValueOnce(
        new Error('Registration failed'),
      );
    }
    await userEvent.click(register);
    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'We could not complete your registration. Please try again.',
    );
    await expect(
      canvas.getByRole('heading', {
        name: 'Registration - step 3 of 4',
      }),
    ).toBeVisible();
    await expect(
      canvas.queryByRole('heading', { name: 'Success' }),
    ).not.toBeInTheDocument();
    await expect(register).toBeEnabled();
    await userEvent.click(register);
    await expect(args.onRegister).toHaveBeenCalledTimes(2);
    await expect(args.onRegister).toHaveBeenLastCalledWith(
      {
        firstName: '',
        lastName: '',
        businessTaxId: '',
        businessCity: '',
        businessPostalCode: '',
        dentistFirstName: '',
        dentistLastName: '',
        licenseId: '',
        licenseState: '',
      },
      {
        username: 'example-provider',
        password: 'Example-password-123',
        email: 'provider@example.com',
        mobileNumber: '',
        challengeQuestion: 'What was your first school?',
        challengeAnswer: 'Example school',
      },
    );
    await expect(
      await canvas.findByRole('heading', { name: 'Success' }),
    ).toHaveFocus();
    await expect(
      canvas.getByText(/code has been sent to provider@example.com/),
    ).toBeVisible();
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
    await expect(canvas.queryByLabelText(/^Password:/)).not.toBeInTheDocument();
    await expect(
      canvas.queryByRole('button', { name: 'Back' }),
    ).not.toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Proceed to Sign In' }),
    );
    await expect(args.onProceedToSignIn).toHaveBeenLastCalledWith('provider');
  }),
};

export const Step3Subscriber: Story = {
  name: 'Step 3 - Subscriber',
  args: { initialStep: 2, initialRole: 'member' },
  play: testOnly(async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const field = (label: string) =>
      canvas.getByLabelText(new RegExp(`^${label}`));
    await expect(
      canvas.getByRole('heading', {
        name: 'Registration - step 3 of 4',
      }),
    ).toBeVisible();
    const emailGroup = within(
      canvas.getByRole('group', { name: 'Email consent' }),
    );
    const textGroup = within(
      canvas.getByRole('group', { name: 'Text message consent' }),
    );
    for (const label of [
      'Username:',
      'Password:',
      'Confirm Password:',
      'Email:',
      'Mobile Number:',
      'Challenge Question:',
      'Challenge Answer:',
    ]) {
      await expect(field(label)).toBeRequired();
      await expect(field(label)).toHaveValue('');
    }
    await expect(field('Password:')).toHaveAttribute('type', 'password');
    await expect(field('Confirm Password:')).toHaveAttribute(
      'type',
      'password',
    );
    for (const radio of canvas.getAllByRole('radio'))
      await expect(radio).not.toBeChecked();
    const register = canvas.getByRole('button', { name: 'Register user' });
    await expect(register).toBeDisabled();
    for (const [label, value] of [
      ['Username:', 'example-subscriber'],
      ['Password:', 'Example-password-123'],
      ['Confirm Password:', 'Different-password'],
      ['Email:', 'not-an-email'],
      ['Challenge Question:', 'What was your first school?'],
      ['Challenge Answer:', 'Example school'],
    ])
      await userEvent.type(field(label), value);
    await userEvent.tab();
    await expect(canvas.getByText('Passwords must match.')).toBeVisible();
    await expect(
      canvas.getByText('Enter a valid email address.'),
    ).toBeVisible();
    await userEvent.clear(field('Confirm Password:'));
    await userEvent.type(field('Confirm Password:'), 'Example-password-123');
    await userEvent.clear(field('Email:'));
    await userEvent.type(field('Email:'), 'subscriber@example.com');
    await expect(register).toBeDisabled();
    await userEvent.type(field('Mobile Number:'), '5551234567');
    await userEvent.tab();
    await expect(register).toBeEnabled();
    await userEvent.click(emailGroup.getByRole('radio', { name: 'I Agree' }));
    for (const radio of textGroup.getAllByRole('radio'))
      await expect(radio).not.toBeChecked();
    await userEvent.click(textGroup.getByRole('radio', { name: 'I Decline' }));
    await expect(
      emailGroup.getByRole('radio', { name: 'I Agree' }),
    ).toBeChecked();
    await userEvent.click(emailGroup.getByRole('radio', { name: 'I Decline' }));
    await expect(register).toBeEnabled();
    await userEvent.click(emailGroup.getByRole('radio', { name: 'I Agree' }));
    await expect(register).toBeEnabled();
    await userEvent.click(register);
    await expect(args.onRegister).not.toHaveBeenCalled();
    await expect(args.onSubscriberRegister).toHaveBeenCalledTimes(1);
    await expect(args.onSubscriberRegister).toHaveBeenLastCalledWith(
      {
        firstName: '',
        lastName: '',
        memberId: '',
        dateOfBirth: '',
        zipCode: '',
        dependentFirstName: '',
        dependentLastName: '',
        dependentDateOfBirth: '',
      },
      {
        username: 'example-subscriber',
        password: 'Example-password-123',
        email: 'subscriber@example.com',
        mobileNumber: '5551234567',
        challengeQuestion: 'What was your first school?',
        challengeAnswer: 'Example school',
        emailConsent: true,
        textConsent: false,
      },
    );
    await expect(
      await canvas.findByRole('heading', { name: 'Success' }),
    ).toHaveFocus();
    await expect(
      canvas.getByText(
        "Your account registration was successful. Please click 'Proceed to sign in' to sign in.",
      ),
    ).toBeVisible();
    await expect(
      canvas.queryByText(/verification code/),
    ).not.toBeInTheDocument();
    await expect(
      canvas.queryByRole('group', { name: 'Email consent' }),
    ).not.toBeInTheDocument();
    await expect(
      canvas.queryByRole('button', { name: 'Back' }),
    ).not.toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Proceed to Sign In' }),
    );
    await expect(args.onProceedToSignIn).toHaveBeenLastCalledWith('subscriber');
  }),
};

export const Step4Provider: Story = {
  name: 'Step 4 - Provider',
  args: {
    initialStep: 3,
    initialRole: 'dentist',
    initialVerificationEmail: 'tnussbaumer@deltadental.com',
  },
  play: testOnly(async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', {
        name: 'Registration - step 4 of 4',
      }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('heading', { name: 'Success' }),
    ).toHaveFocus();
    await expect(
      canvas.getByText(/code has been sent to tnussbaumer@deltadental.com/),
    ).toBeVisible();
    await expect(canvas.queryAllByRole('textbox')).toHaveLength(0);
    await expect(canvas.getAllByRole('button')).toHaveLength(1);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Proceed to Sign In' }),
    );
    await expect(args.onProceedToSignIn).toHaveBeenCalledTimes(1);
    await expect(args.onProceedToSignIn).toHaveBeenLastCalledWith('provider');
  }),
};

export const Step4Subscriber: Story = {
  name: 'Step 4 - Subscriber',
  args: { initialStep: 3, initialRole: 'member' },
  play: testOnly(async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', {
        name: 'Registration - step 4 of 4',
      }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('heading', { name: 'Success' }),
    ).toHaveFocus();
    await expect(
      canvas.getByText(
        "Your account registration was successful. Please click 'Proceed to sign in' to sign in.",
      ),
    ).toBeVisible();
    await expect(
      canvas.queryByText(/verification code/),
    ).not.toBeInTheDocument();
    await expect(canvas.queryAllByRole('textbox')).toHaveLength(0);
    await expect(canvas.getAllByRole('button')).toHaveLength(1);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Proceed to Sign In' }),
    );
    await expect(args.onProceedToSignIn).toHaveBeenCalledTimes(1);
    await expect(args.onProceedToSignIn).toHaveBeenLastCalledWith('subscriber');
  }),
};
