import React from 'react';
import { Container, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormContext } from './contexts/FormContext';
import { StepIndicator } from './components/ui/StepIndicator';
import { PersonalInfoForm } from './components/forms/PersonalInfoForm';
import { FamilyFinancialForm } from './components/forms/FamilyFinancialForm';
import { SituationDescriptionsForm } from './components/forms/SituationDescriptionsForm';
import { HeaderBar } from './components/layout/HeaderBar';

const App: React.FC = () => {
  const { t } = useTranslation();
  const { currentStep, completedSteps, goToStep } = useFormContext();

  const renderForm = () => {
    switch (currentStep) {
      case 'personal':
        return <PersonalInfoForm />;
      case 'financial':
        return <FamilyFinancialForm />;
      case 'situation':
        return <SituationDescriptionsForm />;
      default:
        return <PersonalInfoForm />;
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        py: { xs: 1, sm: 2, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <HeaderBar />
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          boxShadow: {
            xs: 'none',
            sm: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
            md: '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
          },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 2,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
          }}
        >
          {t('app.cardTitle')}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 3,
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          {t('app.intro')}
        </Typography>

        <StepIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={goToStep}
        />

        {renderForm()}
      </Paper>
    </Container>
  );
};

export default App;
