import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-settings',
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
    MatSlideToggleModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl:'./settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  notificationForm!: FormGroup;
  appearanceForm!: FormGroup;
  privacyForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  initializeForms(): void {
    this.notificationForm = this.fb.group({
      emailNotifications: [true],
      interviewReminders: [true],
      progressUpdates: [true],
      aiRecommendations: [true]
    });

    this.appearanceForm = this.fb.group({
      theme: ['light'],
      language: ['en'],
      compactMode: [false],
      animations: [true]
    });

    this.privacyForm = this.fb.group({
      profileVisibility: [true],
      analyticsData: [true]
    });
  }

  loadSettings(): void {
    // Load settings from localStorage or backend
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        this.notificationForm.patchValue(settings.notifications || {});
        this.appearanceForm.patchValue(settings.appearance || {});
        this.privacyForm.patchValue(settings.privacy || {});
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }

  saveNotificationSettings(): void {
    const settings = this.getStoredSettings();
    settings.notifications = this.notificationForm.value;
    this.saveSettings(settings);
    this.snackBar.open('Notification settings saved!', 'Close', { duration: 2000 });
  }

  saveAppearanceSettings(): void {
    const settings = this.getStoredSettings();
    settings.appearance = this.appearanceForm.value;
    this.saveSettings(settings);
    this.snackBar.open('Appearance settings saved!', 'Close', { duration: 2000 });
    
    // Apply theme changes
    this.applyTheme(this.appearanceForm.value.theme);
  }

  savePrivacySettings(): void {
    const settings = this.getStoredSettings();
    settings.privacy = this.privacyForm.value;
    this.saveSettings(settings);
    this.snackBar.open('Privacy settings saved!', 'Close', { duration: 2000 });
  }

  private getStoredSettings(): any {
    const savedSettings = localStorage.getItem('userSettings');
    return savedSettings ? JSON.parse(savedSettings) : {};
  }

  private saveSettings(settings: any): void {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }

  private applyTheme(theme: string): void {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');
    
    if (theme === 'dark') {
      body.classList.add('dark-theme');
    } else if (theme === 'light') {
      body.classList.add('light-theme');
    } else {
      // Auto theme - detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      body.classList.add(prefersDark ? 'dark-theme' : 'light-theme');
    }
  }

  exportData(): void {
    // Simulate data export
    const userData = {
      profile: 'User profile data...',
      progress: 'Learning progress...',
      files: 'Uploaded files...',
      settings: this.getStoredSettings(),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'skillup-user-data.json';
    link.click();
    window.URL.revokeObjectURL(url);

    this.snackBar.open('Data exported successfully!', 'Close', { duration: 2000 });
  }

  clearAllData(): void {
    const confirmation = prompt('This will delete ALL your data. Type "DELETE" to confirm:');
    if (confirmation === 'DELETE') {
      localStorage.clear();
      this.snackBar.open('All data cleared successfully!', 'Close', { duration: 3000 });
      // In a real app, you'd also call backend to clear server data
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
  }

  openLink(type: string): void {
    const links = {
      help: 'https://skillup.help',
      terms: 'https://skillup.com/terms',
      privacy: 'https://skillup.com/privacy',
      contact: 'https://skillup.com/contact'
    };

    const url = links[type as keyof typeof links];
    if (url) {
      window.open(url, '_blank');
    } else {
      this.snackBar.open(`${type} page coming soon!`, 'Close', { duration: 2000 });
    }
  }
}
