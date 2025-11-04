import React from 'react';
import ReactDOM from 'react-dom/client';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';
import { FormProvider } from './contexts/FormContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { createAppTheme } from './theme';
import { getEmotionCache } from './theme/createEmotionCache';
import { ErrorBoundary } from './components/ErrorBoundary';
import './i18n/config';

const ThemedApp: React.FC = () => {
  const { direction } = useLanguage();
  const theme = React.useMemo(() => createAppTheme(direction), [direction]);
  const emotionCache = React.useMemo(() => getEmotionCache(direction), [direction]);

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </CacheProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <FormProvider>
          <ThemedApp />
        </FormProvider>
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
