export type FormStep = 'personal' | 'financial' | 'situation';

export interface PersonalInfo {
  name: string;
  nationalId: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | '';
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
}

export interface FamilyFinancialInfo {
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed' | '';
  dependents: number | '';
  employmentStatus: 'employed' | 'unemployed' | 'selfEmployed' | 'retired' | 'student' | '';
  monthlyIncome: number | '';
  housingStatus: 'owned' | 'rented' | 'family' | 'homeless' | '';
}

export interface SituationDescriptions {
  financialSituation: string;
  employmentCircumstances: string;
  reasonForApplying: string;
}

export interface FormData {
  personalInfo: PersonalInfo;
  familyFinancialInfo: FamilyFinancialInfo;
  situationDescriptions: SituationDescriptions;
}
