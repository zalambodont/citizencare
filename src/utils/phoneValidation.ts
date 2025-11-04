export interface PhoneValidationRules {
  requiredLength: number;
  requiredPrefix: string;
}

export const validatePhoneNumber = (
  phoneNumber: string,
  rules?: PhoneValidationRules
): { isValid: boolean; error?: string } => {
  if (!phoneNumber || !phoneNumber.trim()) {
    return { isValid: false, error: 'validation.required' };
  }

  const digitsOnly = phoneNumber.replace(/\D/g, '');

  if (rules) {
    if (digitsOnly.length === rules.requiredLength && digitsOnly.startsWith(rules.requiredPrefix)) {
      return { isValid: true };
    }
    return { isValid: false, error: 'validation.phone' };
  }

  return { isValid: false, error: 'validation.phone' };
};
