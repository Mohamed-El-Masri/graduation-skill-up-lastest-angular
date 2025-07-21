export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
}
