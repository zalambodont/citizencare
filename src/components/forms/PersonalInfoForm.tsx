import React from 'react';
import { TextField, MenuItem, Box, Button, Snackbar, Alert } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useForm, Controller, FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '../../contexts/FormContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { PersonalInfo } from '../../types';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { countries as countryOptions } from '../../data/locations';
import { PhoneInput } from '../inputs/PhoneInput';
import { validatePhoneNumber } from '../../utils/phoneValidation';

export const PersonalInfoForm: React.FC = () => {
  const { t } = useTranslation();
  const { direction, language } = useLanguage();
  const { formData, updatePersonalInfo, nextStep, saveProgress, registerSaveHandler, unregisterSaveHandler } = useFormContext();
  const isRTL = direction === 'rtl';

  const {
    control,
    watch,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<PersonalInfo>({
    defaultValues: formData.personalInfo,
  });

  const translateError = React.useCallback((error?: FieldError) => {
    if (!error?.message) return undefined;
    const message = error.message;
    if (typeof message === 'string' && message.startsWith('validation.')) {
      return t(message);
    }
    return message;
  }, [t]);

  React.useEffect(() => {
    const fieldNames = Object.keys(errors) as Array<keyof PersonalInfo>;
    if (fieldNames.length > 0) {
      trigger(fieldNames);
    }
  }, [direction, language, errors, trigger]);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const autoSaveTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const handler = () => {
      const values = getValues();
      saveProgress({ personalInfo: values });
      setSnackbarOpen(true);
    };

    registerSaveHandler('personal', handler);
    return () => unregisterSaveHandler('personal');
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
        saveProgress({ personalInfo: latest });
      }, 800);
    });

    return () => {
      subscription.unsubscribe();
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, [watch, getValues, saveProgress]);

  const selectedCountryName = watch('country');
  const selectedStateName = watch('state');

  const selectedCountry = React.useMemo(
    () => countryOptions.find(country => country.name === selectedCountryName),
    [selectedCountryName],
  );

  const availableStates = selectedCountry?.states ?? [];
  const selectedState = React.useMemo(
    () => availableStates.find(state => state.name === selectedStateName),
    [availableStates, selectedStateName],
  );
  const availableCities = selectedState?.cities ?? [];

  const previousCountryRef = React.useRef<string | undefined>(formData.personalInfo?.country);
  const previousStateRef = React.useRef<string | undefined>(formData.personalInfo?.state);
  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousCountryRef.current = selectedCountry?.name;
      previousStateRef.current = selectedState?.name;
      return;
    }

    if (selectedCountry?.name !== previousCountryRef.current) {
      previousCountryRef.current = selectedCountry?.name;

      setValue('state', '', { shouldDirty: false, shouldValidate: false });
      setValue('city', '', { shouldDirty: false, shouldValidate: false });

      if (selectedCountry) {
        const currentPhone = getValues('phone') || '';
        const code = selectedCountry.callingCode;
        if (code && !currentPhone.startsWith(code)) {
          setValue('phone', `${code} `, { shouldDirty: false, shouldValidate: false });
        }

        if (currentPhone) {
          trigger('phone');
        }
      }
    }
  }, [selectedCountry, selectedState]);

  React.useEffect(() => {
    if (isInitialMount.current) {
      return;
    }

    const currentStateName = selectedState?.name;

    if (currentStateName !== previousStateRef.current) {
      previousStateRef.current = currentStateName;

      if (!selectedState) {
        setValue('city', '', { shouldDirty: false, shouldValidate: false });
        return;
      }

      const currentCity = getValues('city');
      if (currentCity && !availableCities.includes(currentCity)) {
        setValue('city', '', { shouldDirty: false, shouldValidate: false });
      }
    }
  }, [selectedState, availableCities]);

  const onSubmit = (data: PersonalInfo) => {
    updatePersonalInfo(data);
    nextStep();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'validation.required' }}
            render={({ field }) => (
              <TextField {...field} label={t('personalInfo.name')} error={!!errors.name} helperText={translateError(errors.name)} required />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="nationalId"
            control={control}
            rules={{ required: 'validation.required' }}
            render={({ field }) => (
              <TextField {...field} label={t('personalInfo.nationalId')} error={!!errors.nationalId} helperText={translateError(errors.nationalId)} required />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="dateOfBirth"
            control={control}
            rules={{ required: 'validation.required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('personalInfo.dateOfBirth')}
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.dateOfBirth}
                helperText={translateError(errors.dateOfBirth)}
                required
              />
            )}
          />
        </Grid>
        <Grid size={12}>
          <Controller
            name="gender"
            control={control}
            rules={{ required: 'validation.required' }}
            render={({ field }) => (
              <TextField {...field} select label={t('personalInfo.gender')} error={!!errors.gender} helperText={translateError(errors.gender)} required>
                <MenuItem value="male">{t('gender.male')}</MenuItem>
                <MenuItem value="female">{t('gender.female')}</MenuItem>
                <MenuItem value="other">{t('gender.other')}</MenuItem>
              </TextField>
            )}
          />
        </Grid>
        <Grid size={12}>
          <Controller
            name="country"
            control={control}
            rules={{ required: 'validation.required' }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label={t('personalInfo.country')}
                error={!!errors.country}
                helperText={translateError(errors.country)}
                required
              >
                {countryOptions.map(option => (
                  <MenuItem key={option.code} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="state"
            control={control}
            rules={{ required: 'validation.required' }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label={t('personalInfo.state')}
                error={!!errors.state}
                helperText={translateError(errors.state)}
                required
                disabled={!selectedCountry}
              >
                {availableStates.map(stateOption => (
                  <MenuItem key={stateOption.name} value={stateOption.name}>
                    {stateOption.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="city"
            control={control}
            rules={{ required: 'validation.required' }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label={t('personalInfo.city')}
                error={!!errors.city}
                helperText={translateError(errors.city)}
                required
                disabled={!selectedState}
              >
                {availableCities.map(cityName => (
                  <MenuItem key={cityName} value={cityName}>
                    {cityName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid size={12}>
          <Controller
            name="address"
            control={control}
            rules={{ required: 'validation.required' }}
            render={({ field }) => (
              <TextField {...field} label={t('personalInfo.address')} error={!!errors.address} helperText={translateError(errors.address)} required />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="phone"
            control={control}
            rules={{
              required: 'validation.required',
              validate: value => {
                if (!value) return 'validation.required';

                const validation = validatePhoneNumber(value, selectedCountry?.phoneValidation);

                if (!validation.isValid) {
                  return validation.error || 'validation.phone';
                }

                return true;
              },
            }}
            render={({ field }) => (
              <PhoneInput
                label={t('personalInfo.phone')}
                value={field.value ?? ''}
                onChange={(value) => {
                  field.onChange(value);
                  setTimeout(() => trigger('phone'), 0);
                }}
                onBlur={field.onBlur}
                error={!!errors.phone}
                helperText={translateError(errors.phone)}
                countryCallingCode={selectedCountry?.callingCode}
                placeholder={selectedCountry?.phoneFormat}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="email"
            control={control}
            rules={{ required: 'validation.required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'validation.email' } }}
            render={({ field }) => (
              <TextField {...field} label={t('personalInfo.email')} type="email" error={!!errors.email} helperText={translateError(errors.email)} required />
            )}
          />
        </Grid>
        <Grid size={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
            <Button type="submit" variant="contained" {...(isRTL ? { startIcon: <ArrowBackIcon /> } : { endIcon: <ArrowForwardIcon /> })} size="large">
              {t('navigation.next')}
            </Button>
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
