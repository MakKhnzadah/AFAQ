import { post } from './apiClient';

export interface SchoolRegistrationPayload {
  childFullName: string;
  childDateOfBirth: string;
  guardianFullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  classroomId: string;
  comment?: string;
  consentAccepted: boolean;
  privacyPolicyVersion: string;
}

export interface SchoolRegistrationResponse {
  publicReference: string;
  ageYears: number | null;
  createdAt: string;
}

export async function submitSchoolRegistration(payload: SchoolRegistrationPayload): Promise<SchoolRegistrationResponse> {
  return post<SchoolRegistrationResponse>('/api/public/school-registrations', payload);
}
