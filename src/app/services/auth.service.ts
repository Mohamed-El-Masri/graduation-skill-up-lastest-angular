import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

// Environment
import { environment } from '../../environments/environment';

// Models
import { User } from '../models/user';
import { LoginRequest } from '../models/login-request';
import { RegisterRequest } from '../models/register-request';
import { ForgotPasswordRequest } from '../models/forgot-password-request';
import { ResetPasswordRequest } from '../models/reset-password-request';
import { ChangePasswordRequest } from '../models/change-password-request';
import { VerifyEmailRequest } from '../models/verify-email-request';
import { ResendVerificationRequest } from '../models/resend-verification-request';
import { RefreshTokenRequest } from '../models/refresh-token-request';
import { ValidateResetTokenRequest } from '../models/validate-reset-token-request';
import { Result } from '../models/result';
import { AuthResult } from '../models/auth-result';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly TOKEN_KEY = 'skillup_token';
  private readonly REFRESH_TOKEN_KEY = 'skillup_refresh_token';
  private readonly USER_KEY = 'skillup_user';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeUser();
  }

  private initializeUser(): void {
    const token = this.getToken();
    const user = this.getCurrentUser();
    
    if (token && user && !this.isTokenExpired(token)) {
      this.currentUserSubject.next(user);
    } else {
      this.clearAuthData();
    }
  }

  // Authentication Methods
  register(userData: RegisterRequest): Observable<AuthResult> {
    console.log('Registering user:', userData);
    return this.http.post<AuthResult>(`${this.apiUrl}/Auth/register`, userData)
      .pipe(
        tap(authResult => {
          console.log('Register response:', authResult);
          if (authResult && authResult.success && authResult.token && authResult.user) {
            this.handleAuthSuccess(authResult);
            console.log('Auth success handled for register');
          } else {
            console.log('Register completed but no auto-login');
          }
        }),
        catchError(error => {
          console.error('Register error:', error);
          return this.handleError(error);
        })
      );
  }

  login(credentials: LoginRequest): Observable<AuthResult> {
    console.log('Logging in user:', credentials.email);
    return this.http.post<AuthResult>(`${this.apiUrl}/Auth/login`, credentials)
      .pipe(
        tap(authResult => {
          console.log('Login response:', authResult);
          if (authResult && authResult.success && authResult.token && authResult.user) {
            this.handleAuthSuccess(authResult);
            console.log('Auth success handled for login');
          } else {
            console.log('Login failed:', authResult.message);
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          return this.handleError(error);
        })
      );
  }

  logout(): Observable<Result<boolean>> {
    const headers = this.getAuthHeaders();
    return this.http.post<Result<boolean>>(`${this.apiUrl}/Auth/logout`, {}, { headers })
      .pipe(
        tap(() => {
          this.clearAuthData();
          this.router.navigate(['/login']);
        }),
        catchError(error => {
          // Even if logout fails on server, clear local data
          this.clearAuthData();
          this.router.navigate(['/login']);
          return throwError(error);
        })
      );
  }

  refreshToken(): Observable<Result<AuthResult>> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError('No refresh token available');
    }

    const request: RefreshTokenRequest = { refreshToken };
    return this.http.post<Result<AuthResult>>(`${this.apiUrl}/Auth/refresh`, request)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.handleAuthSuccess(response.data);
          }
        }),
        catchError(error => {
          this.clearAuthData();
          return throwError(error);
        })
      );
  }

  // Password Management
  forgotPassword(request: ForgotPasswordRequest): Observable<Result<boolean>> {
    return this.http.post<Result<boolean>>(`${this.apiUrl}/Auth/forgot-password`, request)
      .pipe(catchError(this.handleError));
  }

  resetPassword(request: ResetPasswordRequest): Observable<Result<boolean>> {
    return this.http.post<Result<boolean>>(`${this.apiUrl}/Auth/reset-password`, request)
      .pipe(catchError(this.handleError));
  }

  changePassword(request: ChangePasswordRequest): Observable<Result<boolean>> {
    const headers = this.getAuthHeaders();
    return this.http.post<Result<boolean>>(`${this.apiUrl}/Auth/change-password`, request, { headers })
      .pipe(catchError(this.handleError));
  }

  validateResetToken(request: ValidateResetTokenRequest): Observable<Result<boolean>> {
    return this.http.post<Result<boolean>>(`${this.apiUrl}/Auth/validate-reset-token`, request)
      .pipe(catchError(this.handleError));
  }

  // Email Verification
  verifyEmail(request: VerifyEmailRequest): Observable<Result<boolean>> {
    return this.http.post<Result<boolean>>(`${this.apiUrl}/Auth/verify-email`, request)
      .pipe(catchError(this.handleError));
  }

  resendVerification(request: ResendVerificationRequest): Observable<Result<boolean>> {
    return this.http.post<Result<boolean>>(`${this.apiUrl}/Auth/resend-verification`, request)
      .pipe(catchError(this.handleError));
  }

  // Token Management
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= exp;
    } catch {
      return true;
    }
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Helper Methods
  private handleAuthSuccess(authResult: AuthResult): void {
    console.log('Handling auth success:', authResult);
    if (authResult.token && authResult.user) {
      // Store all authentication data
      localStorage.setItem(this.TOKEN_KEY, authResult.token);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, authResult.refreshToken);
      localStorage.setItem(this.USER_KEY, JSON.stringify(authResult.user));
      
      // Store additional data for future use
      localStorage.setItem('skillup_expires_at', authResult.expiresAt.toString());
      localStorage.setItem('skillup_user_id', authResult.user.id.toString());
      localStorage.setItem('skillup_user_role', authResult.user.role);
      localStorage.setItem('skillup_user_email', authResult.user.email);
      
      // Update current user subject
      this.currentUserSubject.next(authResult.user);
      console.log('Auth data stored successfully');
    } else {
      console.warn('Auth result missing token or user:', authResult);
    }
  }

  private clearAuthData(): void {
    // Clear all authentication data
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem('skillup_expires_at');
    localStorage.removeItem('skillup_user_id');
    localStorage.removeItem('skillup_user_role');
    localStorage.removeItem('skillup_user_email');
    
    this.currentUserSubject.next(null);
  }

  // Public method to clear auth data
  public clearAuthDataPublic(): void {
    this.clearAuthData();
  }

  private handleError = (error: any): Observable<never> => {
    console.error('Auth Service Error:', error);
    
    // Handle specific HTTP status codes
    if (error.status === 401) {
      this.clearAuthData();
      this.router.navigate(['/login']);
    }
    
    return throwError(error);
  };

  // Utility Methods
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role?.toLowerCase() === role.toLowerCase();
  }

  isStudent(): boolean {
    return this.hasRole('Student');
  }

  isCreator(): boolean {
    return this.hasRole('Creator');
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  getUserDisplayName(): string {
    const user = this.getCurrentUser();
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`.trim();
  }

  // Get specific user data from localStorage
  getCurrentUserId(): number | null {
    const userId = localStorage.getItem('skillup_user_id');
    return userId ? parseInt(userId, 10) : null;
  }

  getCurrentUserRole(): string | null {
    return localStorage.getItem('skillup_user_role');
  }

  getCurrentUserEmail(): string | null {
    return localStorage.getItem('skillup_user_email');
  }

  getTokenExpirationDate(): Date | null {
    const expiresAt = localStorage.getItem('skillup_expires_at');
    return expiresAt ? new Date(expiresAt) : null;
  }

  // Auto-refresh token when it's about to expire
  checkTokenExpiration(): void {
    const token = this.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      const now = Date.now();
      const timeUntilExpiry = exp - now;

      // Refresh token if it expires in less than 5 minutes
      if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
        this.refreshToken().subscribe({
          error: () => {
            this.clearAuthData();
            this.router.navigate(['/login']);
          }
        });
      }
    } catch {
      this.clearAuthData();
    }
  }
}
