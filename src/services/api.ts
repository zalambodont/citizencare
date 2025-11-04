import { FormData } from '../types';

type SubmitApplicationErrorCode = 'VALIDATION_ERROR' | 'NETWORK_ERROR' | 'SERVER_ERROR';

export class MockApiError extends Error {
  code: SubmitApplicationErrorCode;
  status: number;
  details?: Record<string, unknown>;

  constructor(code: SubmitApplicationErrorCode, message: string, status: number, details?: Record<string, unknown>) {
    super(message);
    this.name = 'MockApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

const simulateLatency = (durationMs: number) => new Promise(resolve => setTimeout(resolve, durationMs));

const validateFormData = (formData: FormData) => {
  const fieldErrors: Record<string, string> = {};
  const { personalInfo, familyFinancialInfo, situationDescriptions } = formData;

  if (!personalInfo.name?.trim()) fieldErrors['personalInfo.name'] = 'Name is required.';
  if (!personalInfo.nationalId?.trim()) fieldErrors['personalInfo.nationalId'] = 'National ID is required.';
  if (!personalInfo.phone?.trim()) fieldErrors['personalInfo.phone'] = 'Phone number is required.';
  if (!personalInfo.email?.trim()) fieldErrors['personalInfo.email'] = 'Email is required.';
  if (!familyFinancialInfo.employmentStatus) fieldErrors['familyFinancialInfo.employmentStatus'] = 'Employment status is required.';
  if (!situationDescriptions.financialSituation?.trim()) fieldErrors['situationDescriptions.financialSituation'] = 'Financial situation is required.';
  if (!situationDescriptions.employmentCircumstances?.trim()) fieldErrors['situationDescriptions.employmentCircumstances'] = 'Employment circumstances are required.';
  if (!situationDescriptions.reasonForApplying?.trim()) fieldErrors['situationDescriptions.reasonForApplying'] = 'Reason for applying is required.';

  if (Object.keys(fieldErrors).length > 0) {
    throw new MockApiError('VALIDATION_ERROR', 'Validation failed. Please review the highlighted fields.', 422, { fields: fieldErrors });
  }
};

const simulateNetworkInstability = () => {
  const roll = Math.random();
  if (roll < 0.05) {
    throw new MockApiError('NETWORK_ERROR', 'Network connection lost. Please try again.', 503);
  }
  if (roll < 0.1) {
    throw new MockApiError('SERVER_ERROR', 'Server is temporarily unavailable. Please retry later.', 500);
  }
};

type SubmitApplicationSuccess = {
  success: true;
  id: string;
  message: string;
};

export const submitApplication = async (formData: FormData): Promise<SubmitApplicationSuccess> => {
  try {
    validateFormData(formData);
    await simulateLatency(1000);
    simulateNetworkInstability();

    return {
      success: true,
      id: `APP-${Date.now()}`,
      message: 'Application submitted successfully',
    };
  } catch (error) {
    if (error instanceof MockApiError) {
      throw error;
    }

    const fallbackMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new MockApiError('SERVER_ERROR', fallbackMessage, 500, { originalError: error });
  }
};
