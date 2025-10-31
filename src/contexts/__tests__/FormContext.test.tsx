import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { FormProvider, useFormContext } from '../FormContext';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn() },
  }),
}));

describe('FormContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('sets isSaving while persisting data and then resets', async () => {
    const TestComponent = () => {
      const { saveProgress, isSaving } = useFormContext();

      React.useEffect(() => {
        saveProgress();
      }, [saveProgress]);

      return <span data-testid="saving-state">{isSaving ? 'yes' : 'no'}</span>;
    };

    render(
      <FormProvider>
        <TestComponent />
      </FormProvider>
    );

    expect(screen.getByTestId('saving-state')).toHaveTextContent('yes');

    await waitFor(() => {
      expect(screen.getByTestId('saving-state')).toHaveTextContent('no');
    });
  });

  it('advances and resets steps', () => {
    const TestComponent = () => {
      const { currentStep, nextStep, previousStep, goToStep, clearForm } = useFormContext();

      return (
        <div>
          <span data-testid="step">{currentStep}</span>
          <button onClick={nextStep}>next</button>
          <button onClick={previousStep}>prev</button>
          <button onClick={() => goToStep('situation')}>goSituation</button>
          <button onClick={clearForm}>clear</button>
        </div>
      );
    };

    render(
      <FormProvider>
        <TestComponent />
      </FormProvider>
    );

    expect(screen.getByTestId('step')).toHaveTextContent('personal');

    fireEvent.click(screen.getByText('next'));
    expect(screen.getByTestId('step')).toHaveTextContent('financial');

    fireEvent.click(screen.getByText('goSituation'));
    expect(screen.getByTestId('step')).toHaveTextContent('situation');

    fireEvent.click(screen.getByText('prev'));
    expect(screen.getByTestId('step')).toHaveTextContent('financial');

    fireEvent.click(screen.getByText('clear'));
    expect(screen.getByTestId('step')).toHaveTextContent('personal');
  });
});
