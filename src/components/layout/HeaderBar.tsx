import React from 'react';
import { keyframes } from '@emotion/react';
import { Paper, Box, Avatar, Typography, IconButton, ButtonGroup, Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import { useFormContext } from '../../contexts/FormContext';
import logo from '../../assets/logo.svg';
import flagEn from '../../assets/flag-en.svg';
import flagAr from '../../assets/flag-ae.svg';

const languageOptions: Array<{ code: 'en' | 'ar'; label: string; flag: string }> = [
  { code: 'en', label: 'EN', flag: flagEn },
  { code: 'ar', label: 'AR', flag: flagAr },
];

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const HeaderBar: React.FC = () => {
  const { t } = useTranslation();
  const { language, direction, toggleLanguage } = useLanguage();
  const { triggerSave, isSaving } = useFormContext();
  const isRTL = direction === 'rtl';

  const handleSave = () => {
    triggerSave();
  };

  const orderedOptions = isRTL ? [...languageOptions].reverse() : languageOptions;

  return (
    <Paper
      elevation={0}
      sx={{
        mb: { xs: 1, sm: 2, md: 3 },
        px: { xs: 1.5, sm: 2, md: 3 },
        py: { xs: 1.5, sm: 2 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: { xs: 1, sm: 2 },
        boxShadow: {
          xs: 'none',
          sm: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
          md: '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
        <Avatar
          src={logo}
          alt={t('app.title')}
          sx={{
            width: { xs: 36, sm: 42, md: 48 },
            height: { xs: 36, sm: 42, md: 48 },
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography
            variant="h5"
            component="span"
            fontWeight={600}
            sx={{
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
            }}
          >
            {t('app.title')}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              letterSpacing: 0.5,
              fontSize: { xs: '0.65rem', sm: '0.75rem' },
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {t('app.subtitle')}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
        <IconButton
          color="primary"
          onClick={handleSave}
          aria-label={isSaving ? t('navigation.saving') : t('navigation.saveProgress')}
          size="medium"
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            width: { xs: 36, sm: 42, md: 48 },
            height: { xs: 36, sm: 42, md: 48 },
          }}
          disabled={isSaving}
        >
          <SaveIcon
            sx={{
              animation: isSaving ? `${spin} 1s linear infinite` : 'none',
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            }}
          />
        </IconButton>
        <ButtonGroup size="small">
          {orderedOptions.map(option => {
            const isActive = language === option.code;
            return (
              <Button
                key={option.code}
                onClick={() => language !== option.code && toggleLanguage()}
                variant={isActive ? 'contained' : 'outlined'}
                color={isActive ? 'primary' : 'inherit'}
                aria-pressed={isActive}
                sx={{
                  minWidth: { xs: 36, sm: 48, md: 64 },
                  px: { xs: 1, sm: 1.5 },
                  display: 'flex',
                  gap: { xs: 0.5, sm: 1 },
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                <Box
                  component="img"
                  src={option.flag}
                  alt={option.code === 'en' ? 'English flag' : 'UAE flag'}
                  sx={{
                    width: { xs: 18, sm: 20 },
                    height: { xs: 12, sm: 14 },
                    borderRadius: 0.5,
                  }}
                />
                <Box
                  component="span"
                  sx={{
                    display: { xs: 'none', sm: 'inline' },
                  }}
                >
                  {option.label}
                </Box>
              </Button>
            );
          })}
        </ButtonGroup>
      </Box>
    </Paper>
  );
};

export default HeaderBar;
