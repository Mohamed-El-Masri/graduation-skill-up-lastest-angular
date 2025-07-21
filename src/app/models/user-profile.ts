import { User } from './user';

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  specialization?: string;
  studyYear?: number;
  careerGoals?: string;
  bio?: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
  portfolioUrl?: string;
  profilePictureUrl?: string;
  skills: string[];
  interests: string[];
  certifications: string[];
}

export interface UpdateUserProfileRequest {
  bio?: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
  portfolioUrl?: string;
  skills?: string[];
  interests?: string[];
  certifications?: string[];
}

export interface UserStatistics {
  completedCourses: number;
  assessmentsPassed: number;
  totalSkillPoints: number;
  learningPathsStarted: number;
  averageAssessmentScore: number;
  timeSpentLearning: number; // in hours
  achievementsUnlocked: number;
}

export interface UserAchievement {
  id: number;
  title: string;
  description: string;
  iconUrl?: string;
  unlockedAt: Date;
  badgeLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}
