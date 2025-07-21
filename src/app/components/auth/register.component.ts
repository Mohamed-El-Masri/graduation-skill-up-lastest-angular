import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { RegisterRequest } from '../../models/register-request';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <h1>Create New Account</h1>
          <p>Join SkillUp platform and start your learning journey</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <div class="name-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>First Name</mat-label>
              <input
                matInput
                type="text"
                formControlName="firstName"
                [class.is-invalid]="isFieldInvalid('firstName')"
              />
              <mat-error *ngIf="registerForm.get('firstName')?.hasError('required')">
                First name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Last Name</mat-label>
              <input
                matInput
                type="text"
                formControlName="lastName"
                [class.is-invalid]="isFieldInvalid('lastName')"
              />
              <mat-error *ngIf="registerForm.get('lastName')?.hasError('required')">
                Last name is required
              </mat-error>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input
              matInput
              type="email"
              formControlName="email"
              placeholder="example@email.com"
              [class.is-invalid]="isFieldInvalid('email')"
            />
            <mat-icon matSuffix>email</mat-icon>
            <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
              Please enter a valid email
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Phone Number (Optional)</mat-label>
            <input
              matInput
              type="tel"
              formControlName="phoneNumber"
              [class.is-invalid]="isFieldInvalid('phoneNumber')"
            />
            <mat-icon matSuffix>phone</mat-icon>
            <mat-error *ngIf="registerForm.get('phoneNumber')?.hasError('pattern')">
              Please enter a valid phone number
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Date of Birth (Optional)</mat-label>
            <input
              matInput
              [matDatepicker]="picker"
              formControlName="dateOfBirth"
              readonly
            />
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Role</mat-label>
            <mat-select formControlName="role">
              <mat-option value="Student">Student</mat-option>
              <mat-option value="Creator">Content Creator</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input
              matInput
              [type]="hidePassword ? 'password' : 'text'"
              formControlName="password"
              [class.is-invalid]="isFieldInvalid('password')"
            />
            <button
              mat-icon-button
              matSuffix
              type="button"
              (click)="hidePassword = !hidePassword"
            >
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
              Password is required
            </mat-error>
            <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
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
            <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
              Password confirmation is required
            </mat-error>
            <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('passwordMismatch')">
              Passwords do not match
            </mat-error>
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            type="submit"
            class="register-button full-width"
            [disabled]="registerForm.invalid || isLoading"
          >
            <mat-spinner *ngIf="isLoading" diameter="20" class="spinner"></mat-spinner>
            <span *ngIf="!isLoading">Create Account</span>
          </button>

          <div class="login-link">
            <span>Already have an account?</span>
            <a routerLink="/login">Login here</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .register-card {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .register-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .register-header h1 {
      color: #333;
      margin-bottom: 8px;
      font-size: 28px;
      font-weight: 600;
    }

    .register-header p {
      color: #666;
      margin: 0;
      font-size: 16px;
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .name-row {
      display: flex;
      gap: 15px;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      flex: 1;
    }

    .register-button {
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      margin: 10px 0;
      position: relative;
    }

    .spinner {
      margin-right: 10px;
    }

    .login-link {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
    }

    .login-link span {
      color: #666;
      margin-left: 8px;
    }

    .login-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .login-link a:hover {
      color: #764ba2;
    }

    .is-invalid {
      border-color: #f44336 !important;
    }

    @media (max-width: 600px) {
      .register-card {
        padding: 30px 20px;
        max-width: 100%;
      }
      
      .name-row {
        flex-direction: column;
        gap: 20px;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.registerForm = this.createRegisterForm();
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  private createRegisterForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      dateOfBirth: [''],
      role: ['Student', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
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

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const registerRequest: RegisterRequest = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        role: this.registerForm.value.role,
        phoneNumber: this.registerForm.value.phoneNumber || undefined,
        dateOfBirth: this.registerForm.value.dateOfBirth || undefined
      };

      this.authService.register(registerRequest).subscribe({
        next: (authResult) => {
          if (authResult && authResult.success && authResult.token && authResult.user) {
            this.notificationService.success(
              'Account created successfully',
              'Welcome to SkillUp Platform!'
            );
            // Registration with auto-login successful
            this.router.navigate(['/dashboard']);
          } else {
            // Registration successful but no auto-login
            this.notificationService.success(
              'Account created successfully',
              authResult.message || 'Please check your email to activate your account'
            );
            this.router.navigate(['/login'], { 
              queryParams: { message: 'registration-success' } 
            });
          }
        },
        error: (error) => {
          this.handleRegistrationError(error.userMessage || 'An error occurred while creating account');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private handleRegistrationError(message: string): void {
    this.notificationService.error('Registration Error', message);
    this.isLoading = false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }
}
