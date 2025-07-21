import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ForgotPasswordRequest } from '../../models/forgot-password-request';

@Component({
  selector: 'app-forgot-password',
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
    <div class="forgot-password-container">
      <div class="forgot-password-card">
        <div class="forgot-password-header">
          <mat-icon class="icon">lock_reset</mat-icon>
          <h1>Forgot Password?</h1>
          <p>Don't worry, we'll send you a password reset link</p>
        </div>

        <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()" class="forgot-password-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input
              matInput
              type="email"
              formControlName="email"
              placeholder="Enter your email address"
              [class.is-invalid]="isFieldInvalid('email')"
            />
            <mat-icon matSuffix>email</mat-icon>
            <mat-error *ngIf="forgotPasswordForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="forgotPasswordForm.get('email')?.hasError('email')">
              Please enter a valid email
            </mat-error>
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            type="submit"
            class="submit-button full-width"
            [disabled]="forgotPasswordForm.invalid || isLoading"
          >
            <mat-spinner *ngIf="isLoading" diameter="20" class="spinner"></mat-spinner>
            <span *ngIf="!isLoading">Send Reset Link</span>
          </button>

          <div class="back-to-login">
            <a routerLink="/login">
              <mat-icon>arrow_back</mat-icon>
              Back to Sign In
            </a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .forgot-password-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .forgot-password-card {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
      width: 100%;
      max-width: 400px;
    }

    .forgot-password-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .forgot-password-header .icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      color: #667eea;
      margin-bottom: 16px;
    }

    .forgot-password-header h1 {
      color: #333;
      margin-bottom: 8px;
      font-size: 24px;
      font-weight: 600;
    }

    .forgot-password-header p {
      color: #666;
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
    }

    .forgot-password-form {
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

    .is-invalid {
      border-color: #f44336 !important;
    }

    @media (max-width: 480px) {
      .forgot-password-card {
        padding: 30px 20px;
      }
    }
  `]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const request: ForgotPasswordRequest = {
        email: this.forgotPasswordForm.value.email
      };

      this.authService.forgotPassword(request).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.success(
              'Link sent successfully',
              'Please check your email to reset your password'
            );
            this.router.navigate(['/login']);
          } else {
            this.handleError(response.message || 'Failed to send reset link');
          }
        },
        error: (error) => {
          this.handleError(error.userMessage || 'An error occurred while sending the request');
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
    const field = this.forgotPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(): void {
    Object.keys(this.forgotPasswordForm.controls).forEach(key => {
      const control = this.forgotPasswordForm.get(key);
      control?.markAsTouched();
    });
  }
}
