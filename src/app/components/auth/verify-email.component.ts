import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { VerifyEmailRequest } from '../../models/verify-email-request';
import { ResendVerificationRequest } from '../../models/resend-verification-request';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="verify-email-container">
      <div class="verify-email-card">
        <div *ngIf="isLoading" class="loading-state">
          <mat-spinner diameter="60"></mat-spinner>
          <h2>Verifying Email...</h2>
          <p>Please wait while we verify your email address</p>
        </div>

        <div *ngIf="!isLoading && verificationSuccess" class="success-state">
          <mat-icon class="success-icon">check_circle</mat-icon>
          <h2>Verification Successful!</h2>
          <p>Your email address has been verified successfully. You can now use all platform features.</p>
          <button mat-raised-button color="primary" (click)="goToLogin()">
            Sign In
          </button>
        </div>

        <div *ngIf="!isLoading && !verificationSuccess" class="error-state">
          <mat-icon class="error-icon">error</mat-icon>
          <h2>Verification Failed</h2>
          <p>{{ errorMessage }}</p>
          
          <div class="actions">
            <button mat-raised-button color="primary" (click)="resendVerification()" [disabled]="isResending">
              <mat-spinner *ngIf="isResending" diameter="20" class="spinner"></mat-spinner>
              <span *ngIf="!isResending">Resend Verification Link</span>
            </button>
            
            <button mat-stroked-button (click)="goToLogin()">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .verify-email-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .verify-email-card {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
      width: 100%;
      max-width: 400px;
      text-align: center;
    }

    .loading-state,
    .success-state,
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .success-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      color: #4caf50;
    }

    .error-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      color: #f44336;
    }

    h2 {
      color: #333;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    p {
      color: #666;
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
      text-align: center;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
      margin-top: 8px;
    }

    .actions button {
      width: 100%;
      height: 44px;
      font-size: 14px;
    }

    .spinner {
      margin-right: 8px;
    }

    @media (max-width: 480px) {
      .verify-email-card {
        padding: 30px 20px;
      }
      
      .actions {
        flex-direction: column;
      }
    }
  `]
})
export class VerifyEmailComponent implements OnInit {
  isLoading = true;
  isResending = false;
  verificationSuccess = false;
  errorMessage = '';
  token = '';
  email = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Get token from query parameters
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.email = params['email'] || '';
      
      if (this.token) {
        this.verifyEmail();
      } else {
        this.isLoading = false;
        this.verificationSuccess = false;
        this.errorMessage = 'Invalid or missing verification link';
      }
    });
  }

  verifyEmail(): void {
    const request: VerifyEmailRequest = {
      token: this.token
    };

    this.authService.verifyEmail(request).subscribe({
      next: (response) => {
        this.verificationSuccess = response.success;
        if (!response.success) {
          this.errorMessage = response.message || 'Failed to verify email address';
        } else {
          this.notificationService.success(
            'Verification Successful',
            'Your email address has been verified successfully'
          );
        }
      },
      error: (error) => {
        this.verificationSuccess = false;
        this.errorMessage = error.userMessage || 'An error occurred while verifying email address';
        this.notificationService.error(
          'Verification Error',
          this.errorMessage
        );
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  resendVerification(): void {
    if (!this.email) {
      this.notificationService.error(
        'Error',
        'Cannot resend verification link without email address'
      );
      return;
    }

    this.isResending = true;
    
    const request: ResendVerificationRequest = {
      email: this.email
    };

    this.authService.resendVerification(request).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success(
            'Link Sent',
            'New verification link has been sent to your email'
          );
        } else {
          this.notificationService.error(
            'Send Failed',
            response.message || 'Failed to send verification link'
          );
        }
      },
      error: (error) => {
        this.notificationService.error(
          'Send Error',
          error.userMessage || 'An error occurred while sending verification link'
        );
      },
      complete: () => {
        this.isResending = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
