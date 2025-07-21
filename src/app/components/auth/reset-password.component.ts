import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ResetPasswordRequest } from '../../models/reset-password-request';
import { ValidateResetTokenRequest } from '../../models/validate-reset-token-request';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="reset-password-container">
      <div class="reset-password-card">
        <div class="reset-password-header">
          <mat-icon class="icon">lock_reset</mat-icon>
          <h1>Reset Password</h1>
          <p>Please enter your new password</p>
        </div>

        <div *ngIf="!isValidToken && !isLoading" class="error-state">
          <mat-icon>error</mat-icon>
          <h2>Invalid Link</h2>
          <p>This link is invalid or expired</p>
          <button mat-raised-button color="primary" routerLink="/forgot-password">
            Request New Link
          </button>
        </div>

        <form 
          *ngIf="isValidToken" 
          [formGroup]="resetPasswordForm" 
          (ngSubmit)="onSubmit()" 
          class="reset-password-form"
        >
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>New Password</mat-label>
            <input
              matInput
              [type]="hidePassword ? 'password' : 'text'"
              formControlName="newPassword"
              [class.is-invalid]="isFieldInvalid('newPassword')"
            />
            <button
              mat-icon-button
              matSuffix
              type="button"
              (click)="hidePassword = !hidePassword"
            >
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            <mat-error *ngIf="resetPasswordForm.get('newPassword')?.hasError('required')">
              Password is required
            </mat-error>
            <mat-error *ngIf="resetPasswordForm.get('newPassword')?.hasError('minlength')">
              Password must be at least 8 characters
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Confirm Password</mat-label>
            <input
              matInput
              [type]="hideConfirmPassword ? 'password' : 'text'"
              formControlName="confirmPassword"
              [class.is-invalid]="isFieldInvalid('confirmPassword')"
            />
            <button
              mat-icon-button
              matSuffix
              type="button"
              (click)="hideConfirmPassword = !hideConfirmPassword"
            >
              <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            <mat-error *ngIf="resetPasswordForm.get('confirmPassword')?.hasError('required')">
              Password confirmation is required
            </mat-error>
            <mat-error *ngIf="resetPasswordForm.get('confirmPassword')?.hasError('passwordMismatch')">
              Passwords do not match
            </mat-error>
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            type="submit"
            class="submit-button full-width"
            [disabled]="resetPasswordForm.invalid || isLoading"
          >
            <mat-spinner *ngIf="isLoading" diameter="20" class="spinner"></mat-spinner>
            <span *ngIf="!isLoading">Reset Password</span>
          </button>

          <div class="back-to-login">
            <a routerLink="/login">
              <mat-icon>arrow_back</mat-icon>
              Back to Sign In
            </a>
          </div>
        </form>

        <div *ngIf="isLoading && !isValidToken" class="loading-validation">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Validating link...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reset-password-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .reset-password-card {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
      width: 100%;
      max-width: 400px;
    }

    .reset-password-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .reset-password-header .icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      color: #667eea;
      margin-bottom: 16px;
    }

    .reset-password-header h1 {
      color: #333;
      margin-bottom: 8px;
      font-size: 24px;
      font-weight: 600;
    }

    .reset-password-header p {
      color: #666;
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
    }

    .reset-password-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .full-width {
      width: 100%;
    }

    .submit-button {
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      margin: 10px 0;
      position: relative;
    }

    .spinner {
      margin-right: 10px;
    }

    .back-to-login {
      text-align: center;
      margin-top: 20px;
    }

    .back-to-login a {
      color: #667eea;
      text-decoration: none;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: color 0.3s ease;
    }

    .back-to-login a:hover {
      color: #764ba2;
    }

    .back-to-login mat-icon {
      font-size: 18px;
      height: 18px;
      width: 18px;
    }

    .error-state {
      text-align: center;
      padding: 20px;
    }

    .error-state mat-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      color: #f44336;
      margin-bottom: 16px;
    }

    .error-state h2 {
      color: #333;
      margin-bottom: 8px;
      font-size: 20px;
    }

    .error-state p {
      color: #666;
      margin-bottom: 20px;
      font-size: 14px;
    }

    .loading-validation {
      text-align: center;
      padding: 20px;
    }

    .loading-validation p {
      margin-top: 16px;
      color: #666;
      font-size: 14px;
    }

    .is-invalid {
      border-color: #f44336 !important;
    }

    @media (max-width: 480px) {
      .reset-password-card {
        padding: 30px 20px;
      }
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  isValidToken = false;
  token = '';
  email = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = this.createForm();
  }

  ngOnInit(): void {
    // Get token and email from query parameters
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.email = params['email'] || '';
      
      if (this.token && this.email) {
        this.validateToken();
      } else {
        this.isValidToken = false;
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword.hasError('passwordMismatch')) {
      delete confirmPassword.errors!['passwordMismatch'];
      if (Object.keys(confirmPassword.errors!).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  private validateToken(): void {
    this.isLoading = true;
    
    const request: ValidateResetTokenRequest = {
      email: this.email,
      token: this.token
    };

    this.authService.validateResetToken(request).subscribe({
      next: (response) => {
        this.isValidToken = response.success;
        if (!this.isValidToken) {
          this.notificationService.error(
            'Invalid Link',
            'This link is invalid or expired'
          );
        }
      },
      error: () => {
        this.isValidToken = false;
        this.notificationService.error(
          'Verification Error',
          'An error occurred while verifying the link'
        );
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && !this.isLoading && this.isValidToken) {
      this.isLoading = true;
      
      const request: ResetPasswordRequest = {
        token: this.token,
        newPassword: this.resetPasswordForm.value.newPassword,
        confirmPassword: this.resetPasswordForm.value.confirmPassword
      };

      this.authService.resetPassword(request).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.success(
              'Password Reset Successfully',
              'You can now sign in with your new password'
            );
            this.router.navigate(['/login']);
          } else {
            this.handleError(response.message || 'Failed to reset password');
          }
        },
        error: (error) => {
          this.handleError(error.userMessage || 'An error occurred while resetting password');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private handleError(message: string): void {
    this.notificationService.error('Error', message);
    this.isLoading = false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.resetPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(): void {
    Object.keys(this.resetPasswordForm.controls).forEach(key => {
      const control = this.resetPasswordForm.get(key);
      control?.markAsTouched();
    });
  }
}
