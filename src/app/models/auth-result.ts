import { User } from './user';

export interface AuthResult {
  success: boolean;
  message: string;
  token: string;
  refreshToken: string;
  user: User;
  expiresAt: Date;
}
