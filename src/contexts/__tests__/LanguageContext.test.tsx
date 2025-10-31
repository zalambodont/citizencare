import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../LanguageContext';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { changeLanguage: jest.fn() },
  }),
}));

const Display = () => {
  const { language, direction, toggleLanguage } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="dir">{direction}</span>
      <button onClick={toggleLanguage}>toggle</button>
    </div>
  );
};

describe('LanguageContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('provides default language and toggles', () => {
    render(
      <LanguageProvider>
        <Display />
      </LanguageProvider>
    );

    expect(screen.getByTestId('lang')).toHaveTextContent('en');
    expect(screen.getByTestId('dir')).toHaveTextContent('ltr');

    fireEvent.click(screen.getByText('toggle'));

    expect(screen.getByTestId('lang')).toHaveTextContent('ar');
    expect(screen.getByTestId('dir')).toHaveTextContent('rtl');
  });
});
