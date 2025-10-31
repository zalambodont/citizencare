import React from 'react';
import { Box, Stepper, Step, StepButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import { FormStep } from '../../types';

interface StepIndicatorProps {
  currentStep: FormStep;
  completedSteps: FormStep[];
  onStepClick: (step: FormStep) => void;
}

const steps: FormStep[] = ['personal', 'financial', 'situation'];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  completedSteps,
  onStepClick
}) => {
  const { t } = useTranslation();
    useLanguage();
  const activeStep = steps.indexOf(currentStep);

  const isStepClickable = (step: FormStep, index: number): boolean => {
    if (step === currentStep) return false;
    if (completedSteps.includes(step)) return true;
    if (index < activeStep) return true;
    return false;
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        nonLinear
        sx={{
          '& .MuiStepConnector-root': {
            top: '20px',
            left: 'calc(-50% + 20px)',
            right: 'calc(50% + 20px)',
          },
          '& .MuiStepConnector-line': {
            borderColor: 'divider',
            borderTopWidth: 2,
          },
          '& .Mui-completed .MuiStepConnector-line': {
            borderColor: 'primary.main',
          },
          '& .Mui-active .MuiStepConnector-line': {
            borderColor: 'primary.main',
          },
          '& .MuiStep-root': {
            padding: 0,
          },
          '& .MuiStepLabel-root': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          },
          '& .MuiStepLabel-iconContainer': {
            padding: 0,
          },
          '& .MuiStepIcon-root': {
            width: '40px',
            height: '40px',
          },
          '& .MuiStepLabel-labelContainer': {
            marginTop: '8px',
          },
          '& .MuiStepLabel-label': {
            typography: 'body2',
            marginTop: '8px',
            textAlign: 'center',
          },
        }}
      >
        {steps.map((step, index) => {
          const clickable = isStepClickable(step, index);
          const completed = completedSteps.includes(step);

          return (
            <Step key={step} completed={completed}>
              <StepButton
                disableRipple
                onClick={() => clickable && onStepClick(step)}
                disabled={!clickable}
                sx={{
                  cursor: clickable ? 'pointer' : 'default',
                  '& .MuiStepLabel-root': {
                    width: '100%',
                  }
                }}
              >
                {t(`steps.${step}`)}
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};
