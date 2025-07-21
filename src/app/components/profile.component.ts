import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { UserProfile, UpdateUserProfileRequest } from '../models/user-profile';
import { ChangePasswordRequest } from '../models/change-password-request';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatTabsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  userProfile: UserProfile | null = null;
  profileImageUrl: string = '';
  
  personalForm!: FormGroup;
  professionalForm!: FormGroup;
  passwordForm!: FormGroup;
  
  skillsList: string[] = [];
  
  savingPersonal = false;
  savingProfessional = false;
  changingPassword = false;
  loadingProfile = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  initializeForms(): void {
    this.personalForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      dateOfBirth: [''],
      specialization: [''],
      studyYear: [''],
      careerGoals: [''],
      bio: ['']
    });

    this.professionalForm = this.fb.group({
      linkedInUrl: [''],
      gitHubUrl: [''],
      portfolioUrl: [''],
      skills: [[]],
      interests: [[]],
      certifications: [[]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  loadUserProfile(): void {
    this.loadingProfile = true;
    
    // Get current user from auth service
    this.user = this.authService.getCurrentUser();
    
    // Load full profile from backend
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.populateFormData(profile);
        this.profileImageUrl = profile.profilePictureUrl || '';
        this.skillsList = profile.skills || [];
        this.loadingProfile = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.notificationService.error('Error', 'Failed to load profile data');
        this.loadingProfile = false;
      }
    });
  }

  populateFormData(profile: UserProfile): void {
    // Populate personal form
    this.personalForm.patchValue({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : null,
      specialization: profile.specialization,
      studyYear: profile.studyYear,
      careerGoals: profile.careerGoals,
      bio: profile.bio
    });

    // Populate professional form
    this.professionalForm.patchValue({
      linkedInUrl: profile.linkedInUrl,
      gitHubUrl: profile.gitHubUrl,
      portfolioUrl: profile.portfolioUrl,
      skills: profile.skills,
      interests: profile.interests,
      certifications: profile.certifications
    });
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      
      // Upload to server
      this.uploadProfileImage(file);
    }
  }

  uploadProfileImage(file: File): void {
    this.userService.uploadProfilePicture(file).subscribe({
      next: (result) => {
        if (result.success && result.data) {
          this.profileImageUrl = result.data;
          this.notificationService.success('Profile Updated', 'Profile image updated successfully!');
        } else {
          this.notificationService.error('Upload Failed', result.message || 'Failed to upload image');
        }
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        this.notificationService.error('Upload Failed', 'Error uploading profile image');
      }
    });
  }

  addSkill(skill: string): void {
    if (skill && skill.trim() && !this.skillsList.includes(skill.trim())) {
      this.skillsList.push(skill.trim());
    }
  }

  removeSkill(index: number): void {
    this.skillsList.splice(index, 1);
  }

  async savePersonalInfo(): Promise<void> {
    if (this.personalForm.valid) {
      this.savingPersonal = true;
      try {
        const formData = this.personalForm.value;
        const updateRequest: UpdateUserProfileRequest = {
          bio: formData.bio
        };

        this.userService.updateUserProfile(updateRequest).subscribe({
          next: (result) => {
            if (result.success) {
              this.notificationService.success('Profile Updated', 'Personal information updated successfully!');
            } else {
              this.notificationService.error('Update Failed', result.message || 'Failed to update profile');
            }
            this.savingPersonal = false;
          },
          error: (error) => {
            console.error('Error saving personal info:', error);
            this.notificationService.error('Update Failed', 'Error updating personal information');
            this.savingPersonal = false;
          }
        });
      } catch (error) {
        console.error('Error saving personal info:', error);
        this.notificationService.error('Update Failed', 'Error updating personal information');
        this.savingPersonal = false;
      }
    }
  }

  async saveProfessionalInfo(): Promise<void> {
    if (this.professionalForm.valid) {
      this.savingProfessional = true;
      try {
        const formData = this.professionalForm.value;
        const updateRequest: UpdateUserProfileRequest = {
          linkedInUrl: formData.linkedInUrl,
          gitHubUrl: formData.gitHubUrl,
          portfolioUrl: formData.portfolioUrl,
          skills: formData.skills || this.skillsList,
          interests: formData.interests,
          certifications: formData.certifications
        };

        this.userService.updateUserProfile(updateRequest).subscribe({
          next: (result) => {
            if (result.success) {
              this.notificationService.success('Profile Updated', 'Professional information updated successfully!');
            } else {
              this.notificationService.error('Update Failed', result.message || 'Failed to update profile');
            }
            this.savingProfessional = false;
          },
          error: (error) => {
            console.error('Error saving professional info:', error);
            this.notificationService.error('Update Failed', 'Error updating professional information');
            this.savingProfessional = false;
          }
        });
      } catch (error) {
        console.error('Error saving professional info:', error);
        this.notificationService.error('Update Failed', 'Error updating professional information');
        this.savingProfessional = false;
      }
    }
  }

  async changePassword(): Promise<void> {
    if (this.passwordForm.valid) {
      this.changingPassword = true;
      try {
        const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
        
        // Get current user ID
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
          this.notificationService.error('Authentication Error', 'User not authenticated');
          this.changingPassword = false;
          return;
        }

        const request: ChangePasswordRequest = { 
          userId: currentUser.id,
          currentPassword, 
          newPassword, 
          confirmPassword 
        };
        
        this.authService.changePassword(request).subscribe({
          next: (response) => {
            if (response) {
              this.passwordForm.reset();
              this.notificationService.success(
                'Password Changed',
                'Password changed successfully! You will be logged out for security.'
              );
              
              // Log out user for security after password change
              setTimeout(() => {
                this.authService.logout().subscribe({
                  next: () => {
                    this.router.navigate(['/login'], { 
                      queryParams: { message: 'password-changed' } 
                    });
                  },
                  error: () => {
                    // Even if logout fails on server, redirect to login
                    this.router.navigate(['/login']);
                  }
                });
              }, 2000);
            } else {
              this.notificationService.error(
                'Password Change Error', 
                response || 'Error changing password'
              );
            }
          },
          error: (error) => {
            console.error('Error changing password:', error);
            this.notificationService.error(
              'Password Change Error',
              error.userMessage || 'Error changing password'
            );
          },
          complete: () => {
            this.changingPassword = false;
          }
        });
      } catch (error) {
        console.error('Error changing password:', error);
        this.notificationService.error('Password Change Error', 'Error changing password');
        this.changingPassword = false;
      }
    }
  }

  resetPersonalForm(): void {
    this.loadUserProfile();
  }

  resetProfessionalForm(): void {
    this.loadUserProfile();
  }

  exportData(): void {
    // TODO: Implement data export functionality
    this.notificationService.info('Coming Soon', 'Data export feature coming soon!');
  }

  deactivateAccount(): void {
    if (confirm('Are you sure you want to deactivate your account? You can reactivate it later by logging in.')) {
      // TODO: Implement account deactivation
      this.notificationService.info('Coming Soon', 'Account deactivation feature coming soon!');
    }
  }

  deleteAccount(): void {
    const confirmation = prompt('This action cannot be undone. Type "DELETE" to confirm:');
    if (confirmation === 'DELETE') {
      // TODO: Implement account deletion
      this.notificationService.warning('Coming Soon', 'Account deletion feature coming soon!');
    }
  }
}
