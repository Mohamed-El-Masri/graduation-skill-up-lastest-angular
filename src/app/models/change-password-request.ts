export interface ChangePasswordRequest {
  userId: number;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
