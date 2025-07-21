import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ChangePasswordRequest } from '../../models/change-password-request';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  template: `
    <div class="change-password-container">
      <mat-card class="change-password-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>lock</mat-icon>
            Change Password
          </mat-card-title>
          <mat-card-subtitle>
            Please enter your current and new password
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="changePasswordForm" (ngSubmit)="onSubmit()" class="password-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Current Password</mat-label>
              <input
                matInput
                [type]="hideCurrentPassword ? 'password' : 'text'"
                formControlName="currentPassword"
                [class.is-invalid]="isFieldInvalid('currentPassword')"
              />
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="hideCurrentPassword = !hideCurrentPassword"
              >
                <mat-icon>{{hideCurrentPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="changePasswordForm.get('currentPassword')?.hasError('required')">
                Current password is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>New Password</mat-label>
              <input
                matInput
                [type]="hideNewPassword ? 'password' : 'text'"
                formControlName="newPassword"
                [class.is-invalid]="isFieldInvalid('newPassword')"
              />
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="hideNewPassword = !hideNewPassword"
              >
                <mat-icon>{{hideNewPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="changePasswordForm.get('newPassword')?.hasError('required')">
                New password is required
              </mat-error>
              <mat-error *ngIf="changePasswordForm.get('newPassword')?.hasError('minlength')">
                Password must be at least 8 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirm New Password</mat-label>
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
              <mat-error *ngIf="changePasswordForm.get('confirmPassword')?.hasError('required')">
                Password confirmation is required
              </mat-error>
              <mat-error *ngIf="changePasswordForm.get('confirmPassword')?.hasError('passwordMismatch')">
                Passwords do not match
              </mat-error>
            </mat-form-field>
          </form>
        </mat-card-content>

        <mat-card-actions align="end">
          <button
            mat-button
            type="button"
            (click)="resetForm()"
            [disabled]="isLoading"
          >
            Cancel
          </button>
          <button
            mat-raised-button
            color="primary"
            type="submit"
            (click)="onSubmit()"
            [disabled]="changePasswordForm.invalid || isLoading"
          >
            <mat-spinner *ngIf="isLoading" diameter="20" class="spinner"></mat-spinner>
            <span *ngIf="!isLoading">Change Password</span>
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .change-password-container {
      max-width: 500px;
      margin: 20px auto;
      padding: 20px;
    }

    .change-password-card {
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    mat-card-header {
      margin-bottom: 20px;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      font-weight: 600;
    }

    mat-card-title mat-icon {
      color: #667eea;
    }

    mat-card-subtitle {
      margin-top: 8px;
      font-size: 14px;
      color: #666;
    }

    .password-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .full-width {
      width: 100%;
    }

    .spinner {
      margin-right: 8px;
    }

    .is-invalid {
      border-color: #f44336 !important;
    }

    mat-card-actions {
      padding: 16px 24px;
      margin: 0;
    }

    mat-card-actions button {
      margin-left: 8px;
    }

    @media (max-width: 600px) {
      .change-password-container {
        margin: 10px;
        padding: 10px;
      }
      
      mat-card-actions {
        flex-direction: column;
        gap: 8px;
      }
      
      mat-card-actions button {
        width: 100%;
        margin: 0;
      }
    }
  `]
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  isLoading = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.changePasswordForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    
    if (!newPassword || !confirmPassword) {
      return null;
    }
    
    if (newPassword.value !== confirmPassword.value) {
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

  onSubmit(): void {
    if (this.changePasswordForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.handleError('User not authenticated');
        this.isLoading = false;
        return;
      }

      const request: ChangePasswordRequest = {
        userId: currentUser.id,
        currentPassword: this.changePasswordForm.value.currentPassword,
        newPassword: this.changePasswordForm.value.newPassword,
        confirmPassword: this.changePasswordForm.value.confirmPassword
      };

      this.authService.changePassword(request).subscribe({
        next: (response) => {
          if (response) {
            this.notificationService.success(
              'Password Changed',
              'Password changed successfully'
            );
            this.resetForm();
          } else {
            this.handleError('Failed to change password');
          }
        },
        error: (error) => {
          this.handleError(error.userMessage || 'An error occurred while changing password');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  resetForm(): void {
    this.changePasswordForm.reset();
    this.hideCurrentPassword = true;
    this.hideNewPassword = true;
    this.hideConfirmPassword = true;
  }

  private handleError(message: string): void {
    this.notificationService.error('Password Change Error', message);
    this.isLoading = false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.changePasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(): void {
    Object.keys(this.changePasswordForm.controls).forEach(key => {
      const control = this.changePasswordForm.get(key);
      control?.markAsTouched();
    });
  }
}
