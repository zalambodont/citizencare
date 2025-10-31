import { FormData } from '../types';

export const submitApplication = async (_formData: FormData) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    success: true,
    id: `APP-${Date.now()}`,
    message: 'Application submitted successfully',
  };
};
