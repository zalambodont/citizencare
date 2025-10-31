import { render, screen } from '@testing-library/react';
import { StepIndicator } from '../StepIndicator';
import type { FormStep } from '../../../types';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockUseLanguage = jest.fn();

jest.mock('../../../contexts/LanguageContext', () => ({
  useLanguage: () => mockUseLanguage(),
}));

describe('StepIndicator', () => {
  const baseProps = {
    currentStep: 'financial' as FormStep,
    completedSteps: ['personal' as FormStep],
    onStepClick: jest.fn(),
  };

  beforeEach(() => {
    mockUseLanguage.mockReset();
  });

  it('renders with LTR direction and disables the active step', () => {
    mockUseLanguage.mockReturnValue({ language: 'en', direction: 'ltr', toggleLanguage: jest.fn() });

    const { container } = render(<StepIndicator {...baseProps} />);

    expect(container.firstElementChild).toHaveAttribute('dir', 'ltr');

    const buttons = screen.getAllByRole('button');
    expect(buttons[1]).toBeDisabled();
    expect(buttons[0]).not.toBeDisabled();
  });

  it('switches to RTL direction when Arabic is active', () => {
    mockUseLanguage.mockReturnValue({ language: 'ar', direction: 'rtl', toggleLanguage: jest.fn() });

    const { container } = render(<StepIndicator {...baseProps} />);

    expect(container.firstElementChild).toHaveAttribute('dir', 'rtl');
  });
});
