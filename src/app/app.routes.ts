import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  
  // Auth routes (public)
  { path: 'login', loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/auth/register.component').then(m => m.RegisterComponent) },
  { path: 'forgot-password', loadComponent: () => import('./components/auth/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('./components/auth/reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: 'verify-email', loadComponent: () => import('./components/auth/verify-email.component').then(m => m.VerifyEmailComponent) },
  
  // Protected routes
  { path: 'dashboard', loadComponent: () => import('./components/dashboard.component').then(m => m.DashboardComponent), canActivate: [AuthGuard] },
  { path: 'ai-chat', loadComponent: () => import('./components/ai-chat.component').then(m => m.AiChatComponent), canActivate: [AuthGuard] },
  { path: 'cv-builder', loadComponent: () => import('./components/cv-builder.component').then(m => m.CvBuilderComponent), canActivate: [AuthGuard] },
  { path: 'interview-prep', loadComponent: () => import('./components/interview-prep.component').then(m => m.InterviewPrepComponent), canActivate: [AuthGuard] },
  { path: 'file-manager', loadComponent: () => import('./components/file-manager.component').then(m => m.FileManagerComponent), canActivate: [AuthGuard] },
  { path: 'learning-paths', loadComponent: () => import('./components/learning-paths.component').then(m => m.LearningPathsComponent), canActivate: [AuthGuard] },
  { path: 'assessments', loadComponent: () => import('./components/assessments.component').then(m => m.AssessmentsComponent), canActivate: [AuthGuard] },
  { path: 'resources', loadComponent: () => import('./components/resources.component').then(m => m.ResourcesComponent), canActivate: [AuthGuard] },
  { path: 'profile', loadComponent: () => import('./components/profile.component').then(m => m.ProfileComponent), canActivate: [AuthGuard] },
  { path: 'settings', loadComponent: () => import('./components/settings.component').then(m => m.SettingsComponent), canActivate: [AuthGuard] },
  { path: 'change-password', loadComponent: () => import('./components/auth/change-password.component').then(m => m.ChangePasswordComponent), canActivate: [AuthGuard] },
  
  // Fallback
  { path: 'unauthorized', loadComponent: () => import('./components/unauthorized.component').then(m => m.UnauthorizedComponent) },
  { path: '**', redirectTo: '/dashboard' }
];