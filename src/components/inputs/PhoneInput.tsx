import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

interface PhoneInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: boolean;
  helperText?: React.ReactNode;
  countryCallingCode?: string;
  placeholder?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  countryCallingCode,
  placeholder,
}) => {
  const displayValue = React.useMemo(() => {
    if (!value) return '';
    if (countryCallingCode && value.startsWith(countryCallingCode)) {
      return value.slice(countryCallingCode.length).trimStart();
    }
    return value;
  }, [value, countryCallingCode]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/[^0-9]/g, '');
    const combined = countryCallingCode
      ? `${countryCallingCode}${digits}`
      : digits;
    onChange(combined);
  };

  return (
    <TextField
      label={label}
      value={displayValue}
      onChange={handleChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      placeholder={placeholder || '123 456 7890'}
      InputProps={countryCallingCode ? {
        startAdornment: <InputAdornment position="start">{countryCallingCode}</InputAdornment>,
      } : undefined}
    />
  );
};

export default PhoneInput;
