import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { UserProfile, UpdateUserProfileRequest, UserStatistics, UserAchievement } from '../models/user-profile';
import { ChangePasswordRequest } from '../models/change-password-request';
import { Result } from '../models/result';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.apiUrl;
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  constructor(private http: HttpClient) {
    // Listen to localStorage changes to detect logout from other tabs
    window.addEventListener('storage', (event) => {
      if (event.key === 'skillup_user' && !event.newValue) {
        this.clearProfileData();
      }
    });
  }

  /**
   * Get current user profile
   */
  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/users/profile`).pipe(
      tap(profile => this.userProfileSubject.next(profile))
    );
  }

  /**
   * Update user profile
   */
  updateUserProfile(request: UpdateUserProfileRequest): Observable<Result<boolean>> {
    return this.http.put<Result<boolean>>(`${this.apiUrl}/users/profile`, request).pipe(
      tap(result => {
        if (result.success) {
          // Refresh profile data after successful update
          this.getUserProfile().subscribe();
        }
      })
    );
  }

  /**
   * Change user password
   */
  changePassword(request: ChangePasswordRequest): Observable<Result<boolean>> {
    return this.http.post<Result<boolean>>(`${this.apiUrl}/users/change-password`, request);
  }

  /**
   * Get user statistics for dashboard
   */
  getUserStatistics(): Observable<UserStatistics> {
    return this.http.get<UserStatistics>(`${this.apiUrl}/users/statistics`);
  }

  /**
   * Get user achievements
   */
  getUserAchievements(): Observable<UserAchievement[]> {
    return this.http.get<UserAchievement[]>(`${this.apiUrl}/users/achievements`);
  }

  /**
   * Upload profile picture
   */
  uploadProfilePicture(file: File): Observable<Result<string>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<Result<string>>(`${this.apiUrl}/users/profile-picture`, formData).pipe(
      tap(result => {
        if (result.success) {
          // Refresh profile data after successful upload
          this.getUserProfile().subscribe();
        }
      })
    );
  }

  /**
   * Update user preferences/settings
   */
  updateUserPreferences(preferences: any): Observable<Result<boolean>> {
    return this.http.put<Result<boolean>>(`${this.apiUrl}/users/preferences`, preferences);
  }

  /**
   * Delete user account
   */
  deleteUserAccount(reason: string, password: string): Observable<Result<boolean>> {
    return this.http.delete<Result<boolean>>(`${this.apiUrl}/users/account`, {
      body: { reason, password }
    });
  }

  /**
   * Clear cached profile data
   */
  clearProfileData(): void {
    this.userProfileSubject.next(null);
  }

  /**
   * Get current cached profile
   */
  getCurrentProfile(): UserProfile | null {
    return this.userProfileSubject.value;
  }
}
