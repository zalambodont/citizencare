import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  language: 'en' | 'ar';
  direction: 'ltr' | 'rtl';
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'app_language';
const isBrowser = typeof window !== 'undefined';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();

  const getInitialLanguage = (): 'en' | 'ar' => {
    if (!isBrowser) {
      return 'en';
    }

    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored === 'ar' ? 'ar' : 'en';
  };

  const [language, setLanguage] = useState<'en' | 'ar'>(getInitialLanguage);
  const direction: 'ltr' | 'rtl' = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    i18n.changeLanguage(language);

    if (isBrowser) {
      document.documentElement.dir = direction;
      document.documentElement.lang = language;
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [direction, i18n, language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
