import React, { useState } from 'react';
import { TextField, Box, Button, Alert, Snackbar } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '../../contexts/FormContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SituationDescriptions } from '../../types';
import { generateAISuggestion } from '../../services/openai';
import { submitApplication } from '../../services/api';
import { AISuggestionDialog } from '../ui/AISuggestionDialog';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';

type FieldName = keyof SituationDescriptions;

export const SituationDescriptionsForm: React.FC = () => {
  const { t } = useTranslation();
  const { direction, language } = useLanguage();
  const { formData, updateSituationDescriptions, previousStep, clearForm, saveProgress, registerSaveHandler, unregisterSaveHandler } = useFormContext();
  const isRTL = direction === 'rtl';

  const { control, handleSubmit, setValue, watch, getValues, formState: { errors, isSubmitting }, trigger } = useForm<SituationDescriptions>({
    defaultValues: formData.situationDescriptions,
  });

  React.useEffect(() => {
    if (Object.keys(errors).length > 0) trigger();
  }, [direction, language, errors, trigger]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [currentField, setCurrentField] = useState<FieldName | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [attemptCounters, setAttemptCounters] = useState<Record<FieldName, number>>({
    financialSituation: 0,
    employmentCircumstances: 0,
    reasonForApplying: 0,
  });
  const autoSaveTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const handler = () => {
      const values = getValues();
      saveProgress({ situationDescriptions: values });
      setSnackbar({ open: true, message: t('messages.progressSaved'), severity: 'success' });
    };

    registerSaveHandler('situation', handler);
    return () => unregisterSaveHandler('situation');
  }, [getValues, registerSaveHandler, unregisterSaveHandler, saveProgress, t]);

  React.useEffect(() => {
    const subscription = watch((_, info) => {
      if (info?.type !== 'change') {
        return;
      }

      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }

      autoSaveTimeout.current = setTimeout(() => {
        const latest = getValues();
        saveProgress({ situationDescriptions: latest });
      }, 800);
    });

    return () => {
      subscription.unsubscribe();
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, [watch, getValues, saveProgress]);

  const handleAIAssist = async (fieldName: FieldName, customContext?: string) => {
    setCurrentField(fieldName);
    setDialogOpen(true);
    setAiLoading(true);
    setAiError(null);
    setAiSuggestion('');

    try {
      const currentValue = customContext !== undefined ? customContext : watch(fieldName);
      setAttemptCounters(prev => ({ ...prev, [fieldName]: prev[fieldName] + 1 }));
      const response = await generateAISuggestion({
        fieldName,
        context: currentValue || '',
        language,
        attempt: attemptCounters[fieldName] + 1,
        demographicInfo: formData.familyFinancialInfo,
      });
      setAiSuggestion(response.suggestion);
    } catch (error) {
      const fallbackMessage = t('messages.aiError');
      const errorMessage = error instanceof Error ? error.message : fallbackMessage;
      setAiError(errorMessage || fallbackMessage);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAcceptSuggestion = (text: string) => {
    if (currentField) {
      setValue(currentField, text);
      updateSituationDescriptions({ [currentField]: text });
    }
    setDialogOpen(false);
  };

  const handleDiscardSuggestion = () => {
    setDialogOpen(false);
    setAiSuggestion('');
    setAiError(null);
    if (currentField) {
      setAttemptCounters(prev => ({ ...prev, [currentField]: 0 }));
    }
  };

  const handleRefreshSuggestion = (editedContext: string) => {
    if (!currentField) {
      return;
    }

    handleAIAssist(currentField, editedContext);
  };

  const onSubmit = async (data: SituationDescriptions) => {
    try {
      updateSituationDescriptions(data);
      const fullFormData = { ...formData, situationDescriptions: data };
      const result = await submitApplication(fullFormData);
      setSnackbar({ open: true, message: `${t('messages.applicationSubmitted')} ${result.id}`, severity: 'success' });
      setTimeout(() => clearForm(), 2000);
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error instanceof Error ? error.message : t('messages.submissionError');
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          <Grid size={12}>
            <Controller
              name="financialSituation"
              control={control}
              rules={{ required: t('validation.required'), minLength: { value: 20, message: t('validation.minLength', { min: 20 }) } }}
              render={({ field }) => (
                <Box>
                  <TextField {...field} multiline rows={4} label={t('situation.financialSituation')} error={!!errors.financialSituation} required slotProps={{ formHelperText: { component: 'div' } }} helperText={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                      <span>{errors.financialSituation?.message || t('situation.financialSituationHelper')}</span>
                      <Button variant="text" size="small" {...(isRTL ? { endIcon: <AutoAwesomeIcon sx={{ fontSize: '16px !important' }} /> } : { startIcon: <AutoAwesomeIcon sx={{ fontSize: '16px !important' }} /> })} onClick={() => handleAIAssist('financialSituation')} sx={{ minHeight: 'auto', padding: '2px 8px', fontSize: '0.75rem', textTransform: 'none' }}>{t('situation.orGenerateWithAI')}</Button>
                    </Box>
                  } />
                </Box>
              )}
            />
          </Grid>
          <Grid size={12}>
            <Controller
              name="employmentCircumstances"
              control={control}
              rules={{ required: t('validation.required'), minLength: { value: 20, message: t('validation.minLength', { min: 20 }) } }}
              render={({ field }) => (
                <Box>
                  <TextField {...field} multiline rows={4} label={t('situation.employmentCircumstances')} error={!!errors.employmentCircumstances} required slotProps={{ formHelperText: { component: 'div' } }} helperText={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                      <span>{errors.employmentCircumstances?.message || t('situation.employmentCircumstancesHelper')}</span>
                      <Button variant="text" size="small" {...(isRTL ? { endIcon: <AutoAwesomeIcon sx={{ fontSize: '16px !important' }} /> } : { startIcon: <AutoAwesomeIcon sx={{ fontSize: '16px !important' }} /> })} onClick={() => handleAIAssist('employmentCircumstances')} sx={{ minHeight: 'auto', padding: '2px 8px', fontSize: '0.75rem', textTransform: 'none' }}>{t('situation.orGenerateWithAI')}</Button>
                    </Box>
                  } />
                </Box>
              )}
            />
          </Grid>
          <Grid size={12}>
            <Controller
              name="reasonForApplying"
              control={control}
              rules={{ required: t('validation.required'), minLength: { value: 20, message: t('validation.minLength', { min: 20 }) } }}
              render={({ field }) => (
                <Box>
                  <TextField {...field} multiline rows={4} label={t('situation.reasonForApplying')} error={!!errors.reasonForApplying} required slotProps={{ formHelperText: { component: 'div' } }} helperText={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                      <span>{errors.reasonForApplying?.message || t('situation.reasonForApplyingHelper')}</span>
                      <Button variant="text" size="small" {...(isRTL ? { endIcon: <AutoAwesomeIcon sx={{ fontSize: '16px !important' }} /> } : { startIcon: <AutoAwesomeIcon sx={{ fontSize: '16px !important' }} /> })} onClick={() => handleAIAssist('reasonForApplying')} sx={{ minHeight: 'auto', padding: '2px 8px', fontSize: '0.75rem', textTransform: 'none' }}>{t('situation.orGenerateWithAI')}</Button>
                    </Box>
                  } />
                </Box>
              )}
            />
          </Grid>
          <Grid size={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Button onClick={previousStep} {...(isRTL ? { endIcon: <ArrowForwardIcon /> } : { startIcon: <ArrowBackIcon /> })} size="large" disabled={isSubmitting}>{t('navigation.back')}</Button>
              <Button type="submit" variant="contained" {...(isRTL ? { startIcon: <SendIcon /> } : { endIcon: <SendIcon /> })} size="large" disabled={isSubmitting}>{t('navigation.submit')}</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <AISuggestionDialog open={dialogOpen} suggestion={aiSuggestion} loading={aiLoading} error={aiError} onAccept={handleAcceptSuggestion} onDiscard={handleDiscardSuggestion} onRefresh={handleRefreshSuggestion} />
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};
