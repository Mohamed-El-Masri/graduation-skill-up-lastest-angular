import { User } from "./user";
import { AuthResult } from "./auth-result";

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresAt: Date;
}

// Alternative interface that matches the backend Result<AuthResult> structure
export interface LoginResultResponse {
  success: boolean;
  message: string;
  data: AuthResult;
  errors?: string[];
}
