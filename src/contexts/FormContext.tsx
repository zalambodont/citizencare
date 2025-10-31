import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import { FormData, FormStep, PersonalInfo, FamilyFinancialInfo, SituationDescriptions } from '../types';

interface FormContextType {
  formData: FormData;
  currentStep: FormStep;
  completedSteps: FormStep[];
  updatePersonalInfo: (data: PersonalInfo) => void;
  updateFamilyFinancialInfo: (data: FamilyFinancialInfo) => void;
  updateSituationDescriptions: (data: Partial<SituationDescriptions>) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: FormStep) => void;
  saveProgress: (data?: Partial<FormData>) => void;
  registerSaveHandler: (step: FormStep, handler: () => void) => void;
  unregisterSaveHandler: (step: FormStep) => void;
  triggerSave: () => void;
  isSaving: boolean;
  clearForm: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const STORAGE_KEY = 'social_support_form_data';
const CURRENT_STEP_KEY = 'social_support_current_step';
const COMPLETED_STEPS_KEY = 'social_support_completed_steps';
const isBrowser = typeof window !== 'undefined';

const initialFormData: FormData = {
  personalInfo: {
    name: '',
    nationalId: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    email: '',
  },
  familyFinancialInfo: {
    maritalStatus: '',
    dependents: '',
    employmentStatus: '',
    monthlyIncome: '',
    housingStatus: '',
  },
  situationDescriptions: {
    financialSituation: '',
    employmentCircumstances: '',
    reasonForApplying: '',
  },
};

const steps: FormStep[] = ['personal', 'financial', 'situation'];

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const saveHandlersRef = useRef(new Map<FormStep, () => void>());
  const saveIndicatorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [formData, setFormData] = useState<FormData>(() => {
    if (!isBrowser) {
      return initialFormData;
    }

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialFormData;
    } catch (error) {
      console.warn('Failed to read form data from localStorage', error);
      return initialFormData;
    }
  });

  const [currentStep, setCurrentStep] = useState<FormStep>(() => {
    if (!isBrowser) {
      return 'personal';
    }

    const saved = window.localStorage.getItem(CURRENT_STEP_KEY);
    return (saved as FormStep) || 'personal';
  });

  const [completedSteps, setCompletedSteps] = useState<FormStep[]>(() => {
    if (!isBrowser) {
      return [];
    }

    try {
      const saved = window.localStorage.getItem(COMPLETED_STEPS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn('Failed to read completed steps from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    window.localStorage.setItem(CURRENT_STEP_KEY, currentStep);
  }, [currentStep]);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    window.localStorage.setItem(COMPLETED_STEPS_KEY, JSON.stringify(completedSteps));
  }, [completedSteps]);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (saveIndicatorTimeoutRef.current) {
        clearTimeout(saveIndicatorTimeoutRef.current);
      }
    };
  }, []);

  const updatePersonalInfo = (data: PersonalInfo) => {
    setFormData(prev => ({ ...prev, personalInfo: data }));
  };

  const updateFamilyFinancialInfo = (data: FamilyFinancialInfo) => {
    setFormData(prev => ({ ...prev, familyFinancialInfo: data }));
  };

  const updateSituationDescriptions = (data: Partial<SituationDescriptions>) => {
    setFormData(prev => ({
      ...prev,
      situationDescriptions: { ...prev.situationDescriptions, ...data }
    }));
  };

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const previousStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const goToStep = (step: FormStep) => {
    setCurrentStep(step);
  };

  const mergeFormData = (prev: FormData, updates?: Partial<FormData>): FormData => {
    if (!updates) {
      return prev;
    }

    return {
      personalInfo: updates.personalInfo ? { ...prev.personalInfo, ...updates.personalInfo } : prev.personalInfo,
      familyFinancialInfo: updates.familyFinancialInfo ? { ...prev.familyFinancialInfo, ...updates.familyFinancialInfo } : prev.familyFinancialInfo,
      situationDescriptions: updates.situationDescriptions ? { ...prev.situationDescriptions, ...updates.situationDescriptions } : prev.situationDescriptions,
    };
  };

  const saveProgress = (data?: Partial<FormData>) => {
    if (saveIndicatorTimeoutRef.current) {
      clearTimeout(saveIndicatorTimeoutRef.current);
    }
    setIsSaving(true);

    setFormData(prev => {
      const merged = mergeFormData(prev, data);

      if (isBrowser) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        window.localStorage.setItem(CURRENT_STEP_KEY, currentStep);
        window.localStorage.setItem(COMPLETED_STEPS_KEY, JSON.stringify(completedSteps));
      }

      return merged;
    });

    saveIndicatorTimeoutRef.current = setTimeout(() => {
      setIsSaving(false);
    }, 800);
  };

  const registerSaveHandler = useCallback((step: FormStep, handler: () => void) => {
    saveHandlersRef.current.set(step, handler);
  }, []);

  const unregisterSaveHandler = useCallback((step: FormStep) => {
    saveHandlersRef.current.delete(step);
  }, []);

  const triggerSave = () => {
    const handler = saveHandlersRef.current.get(currentStep);
    if (handler) {
      handler();
    } else {
      saveProgress();
    }
  };

  const clearForm = () => {
    setFormData(initialFormData);
    setCurrentStep('personal');
    setCompletedSteps([]);
    if (isBrowser) {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(CURRENT_STEP_KEY);
      window.localStorage.removeItem(COMPLETED_STEPS_KEY);
    }
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        currentStep,
        completedSteps,
        updatePersonalInfo,
        updateFamilyFinancialInfo,
        updateSituationDescriptions,
        nextStep,
        previousStep,
        goToStep,
        saveProgress,
        registerSaveHandler,
        unregisterSaveHandler,
        triggerSave,
        isSaving,
        clearForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider');
  }
  return context;
};
