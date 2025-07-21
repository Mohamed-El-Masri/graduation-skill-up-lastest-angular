
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  specialization?: string;
  studyYear?: number;
  careerGoals?: string;
  role: string;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  isActive: boolean;
}