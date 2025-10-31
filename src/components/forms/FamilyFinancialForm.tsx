import React from 'react';
import { Grid, TextField, MenuItem, Box, Button, Snackbar, Alert, InputAdornment } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '../../contexts/FormContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FamilyFinancialInfo } from '../../types';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { countries } from '../../data/locations';

export const FamilyFinancialForm: React.FC = () => {
  const { t } = useTranslation();
  const { direction, language } = useLanguage();
  const { formData, updateFamilyFinancialInfo, nextStep, previousStep, saveProgress, registerSaveHandler, unregisterSaveHandler } = useFormContext();
  const isRTL = direction === 'rtl';

  const { control, watch, handleSubmit, getValues, formState: { errors }, trigger } = useForm<FamilyFinancialInfo>({
    defaultValues: formData.familyFinancialInfo,
  });

  const selectedCountryName = formData.personalInfo?.country;
  const currency = React.useMemo(() => {
    const country = countries.find(c => c.name === selectedCountryName);
    return country?.currency || 'USD';
  }, [selectedCountryName]);

  React.useEffect(() => {
    if (Object.keys(errors).length > 0) trigger();
  }, [direction, language, errors, trigger]);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const autoSaveTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const handler = () => {
      const values = getValues();
      saveProgress({ familyFinancialInfo: values });
      setSnackbarOpen(true);
    };

    registerSaveHandler('financial', handler);
    return () => unregisterSaveHandler('financial');
  }, [getValues, registerSaveHandler, unregisterSaveHandler, saveProgress]);

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
        saveProgress({ familyFinancialInfo: latest });
      }, 800);
    });

    return () => {
      subscription.unsubscribe();
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, [watch, getValues, saveProgress]);

  const onSubmit = (data: FamilyFinancialInfo) => {
    updateFamilyFinancialInfo(data);
    nextStep();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name="maritalStatus"
            control={control}
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <TextField {...field} select label={t('familyFinancial.maritalStatus')} error={!!errors.maritalStatus} helperText={errors.maritalStatus?.message} required>
                <MenuItem value="single">{t('maritalStatus.single')}</MenuItem>
                <MenuItem value="married">{t('maritalStatus.married')}</MenuItem>
                <MenuItem value="divorced">{t('maritalStatus.divorced')}</MenuItem>
                <MenuItem value="widowed">{t('maritalStatus.widowed')}</MenuItem>
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="dependents"
            control={control}
            rules={{
              required: t('validation.required'),
              validate: value => {
                const num = Number(value);
                if (isNaN(num)) return t('validation.positiveNumber');
                if (num < 0) return t('validation.positiveNumber');
                if (!Number.isInteger(num)) return t('validation.positiveNumber');
                return true;
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                type="text"
                label={t('familyFinancial.dependents')}
                error={!!errors.dependents}
                helperText={errors.dependents?.message}
                required
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="employmentStatus"
            control={control}
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <TextField {...field} select label={t('familyFinancial.employmentStatus')} error={!!errors.employmentStatus} helperText={errors.employmentStatus?.message} required>
                <MenuItem value="employed">{t('employmentStatus.employed')}</MenuItem>
                <MenuItem value="unemployed">{t('employmentStatus.unemployed')}</MenuItem>
                <MenuItem value="selfEmployed">{t('employmentStatus.selfEmployed')}</MenuItem>
                <MenuItem value="retired">{t('employmentStatus.retired')}</MenuItem>
                <MenuItem value="student">{t('employmentStatus.student')}</MenuItem>
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="monthlyIncome"
            control={control}
            rules={{
              required: t('validation.required'),
              validate: value => {
                const num = Number(value);
                if (isNaN(num)) return t('validation.positiveNumber');
                if (num < 0) return t('validation.positiveNumber');
                return true;
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                type="text"
                label={t('familyFinancial.monthlyIncome')}
                error={!!errors.monthlyIncome}
                helperText={errors.monthlyIncome?.message}
                required
                inputProps={{ inputMode: 'decimal', pattern: '[0-9]*\\.?[0-9]*' }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{currency}</InputAdornment>,
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="housingStatus"
            control={control}
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <TextField {...field} select label={t('familyFinancial.housingStatus')} error={!!errors.housingStatus} helperText={errors.housingStatus?.message} required>
                <MenuItem value="owned">{t('housingStatus.owned')}</MenuItem>
                <MenuItem value="rented">{t('housingStatus.rented')}</MenuItem>
                <MenuItem value="family">{t('housingStatus.family')}</MenuItem>
                <MenuItem value="homeless">{t('housingStatus.homeless')}</MenuItem>
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Button onClick={previousStep} {...(isRTL ? { endIcon: <ArrowForwardIcon /> } : { startIcon: <ArrowBackIcon /> })} size="large">{t('navigation.back')}</Button>
            <Button type="submit" variant="contained" {...(isRTL ? { startIcon: <ArrowBackIcon /> } : { endIcon: <ArrowForwardIcon /> })} size="large">{t('navigation.next')}</Button>
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }} onClose={() => setSnackbarOpen(false)}>
          {t('messages.progressSaved')}
        </Alert>
      </Snackbar>
    </Box>
  );
};
