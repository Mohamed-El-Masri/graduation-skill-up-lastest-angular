import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { UserProfile, UserStatistics, UserAchievement } from '../models/user-profile';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatGridListModule
  ],
  templateUrl:'./dashboard.component.html' ,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  userProfile: UserProfile | null = null;
  userStatistics: UserStatistics | null = null;
  userAchievements: UserAchievement[] = [];
  
  isLoadingStats = false;
  isLoadingAchievements = false;
  
  // Make Math available in template
  Math = Math;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    // Load current user data from AuthService
    this.currentUser = this.authService.getCurrentUser();
    
    // Subscribe to user changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUserData();
      }
    });
    
    // Load initial data if user is already authenticated
    if (this.currentUser) {
      this.loadUserData();
    }
  }

  loadUserData(): void {
    this.loadUserProfile();
    this.loadUserStatistics();
    this.loadUserAchievements();
  }

  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
      }
    });
  }

  loadUserStatistics(): void {
    this.isLoadingStats = true;
    this.userService.getUserStatistics().subscribe({
      next: (stats) => {
        this.userStatistics = stats;
        this.isLoadingStats = false;
      },
      error: (error) => {
        console.error('Error loading user statistics:', error);
        this.notificationService.error('Error', 'Failed to load dashboard statistics');
        this.isLoadingStats = false;
        // Set default values on error
        this.userStatistics = {
          completedCourses: 0,
          assessmentsPassed: 0,
          totalSkillPoints: 0,
          learningPathsStarted: 0,
          averageAssessmentScore: 0,
          timeSpentLearning: 0,
          achievementsUnlocked: 0
        };
      }
    });
  }

  loadUserAchievements(): void {
    this.isLoadingAchievements = true;
    this.userService.getUserAchievements().subscribe({
      next: (achievements) => {
        this.userAchievements = achievements;
        this.isLoadingAchievements = false;
      },
      error: (error) => {
        console.error('Error loading user achievements:', error);
        this.isLoadingAchievements = false;
      }
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  // Helper methods for template
  getUserSkill(index: number): string {
    if (this.userProfile?.skills && this.userProfile.skills.length > index) {
      return this.userProfile.skills[index];
    }
    const defaultSkills = ['Programming', 'Design', 'Analytics'];
    return defaultSkills[index] || 'Skill';
  }

  hasUserSkills(): boolean {
    return !!(this.userProfile?.skills && this.userProfile.skills.length > 0);
  }
}
