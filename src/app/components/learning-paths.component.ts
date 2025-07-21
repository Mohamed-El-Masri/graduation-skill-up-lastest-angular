import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LearningPath } from '../models/learning-path';
import { Content } from '../models/content';

@Component({
  selector: 'app-learning-paths',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTabsModule,
    MatBadgeModule,
    MatDialogModule
  ],
  templateUrl: './learning-paths.component.html',
  styleUrls: ['./learning-paths.component.scss']
})
export class LearningPathsComponent implements OnInit {
  searchControl = new FormControl('');
  levelFilter = new FormControl([]);
  durationFilter = new FormControl('');

  learningPaths: LearningPath[] = [];
  filteredPaths: LearningPath[] = [];
  enrolledPaths: number[] = [];
  pathProgress: { [pathId: number]: number } = {};
  pathContents: { [pathId: number]: Content[] } = {};

  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadLearningPaths();
    this.loadUserProgress();
    this.setupFilters();
  }

  setupFilters(): void {
    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.levelFilter.valueChanges.subscribe(() => this.applyFilters());
    this.durationFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  loadLearningPaths(): void {
    // Simulate loading learning paths - replace with actual service call
    this.learningPaths = [
      {
        id: 1,
        title: 'Frontend Development with Angular',
        description: 'Master modern web development with Angular, TypeScript, and best practices',
        level: 'Intermediate',
        duration: 40,
        prerequisites: ['HTML', 'CSS', 'JavaScript'],
        learningObjectives: [
          'Build single-page applications with Angular',
          'Master TypeScript and RxJS',
          'Implement responsive designs with Angular Material',
          'Deploy applications to production'
        ],
        imageUrl: '',
        isActive: true
      },
      {
        id: 2,
        title: 'Full-Stack Development with .NET',
        description: 'Complete backend development using ASP.NET Core and Entity Framework',
        level: 'Advanced',
        duration: 60,
        prerequisites: ['C#', 'OOP Concepts', 'SQL'],
        learningObjectives: [
          'Build RESTful APIs with ASP.NET Core',
          'Implement authentication and authorization',
          'Work with databases using Entity Framework',
          'Deploy to cloud platforms'
        ],
        imageUrl: '',
        isActive: true
      },
      {
        id: 3,
        title: 'AI and Machine Learning Fundamentals',
        description: 'Introduction to AI, ML algorithms, and practical implementations',
        level: 'Beginner',
        duration: 30,
        prerequisites: ['Python', 'Basic Mathematics'],
        learningObjectives: [
          'Understand ML concepts and algorithms',
          'Work with popular ML libraries',
          'Build predictive models',
          'Evaluate model performance'
        ],
        imageUrl: '',
        isActive: true
      },
      {
        id: 4,
        title: 'DevOps and Cloud Computing',
        description: 'Modern DevOps practices, CI/CD, and cloud deployment strategies',
        level: 'Intermediate',
        duration: 35,
        prerequisites: ['Linux basics', 'Git', 'Docker'],
        learningObjectives: [
          'Setup CI/CD pipelines',
          'Deploy applications to cloud',
          'Monitor and scale applications',
          'Implement infrastructure as code'
        ],
        imageUrl: '',
        isActive: true
      }
    ];

    // Simulate content for each path
    this.pathContents = {
      1: Array.from({length: 12}, (_, i) => ({
        id: i + 1,
        title: `Module ${i + 1}`,
        description: `Angular module ${i + 1}`,
        contentType: 'video',
        contentUrl: '',
        duration: 180,
        learningPathId: 1,
        order: i + 1,
        isActive: true
      })),
      2: Array.from({length: 15}, (_, i) => ({
        id: i + 16,
        title: `Module ${i + 1}`,
        description: `.NET module ${i + 1}`,
        contentType: 'video',
        contentUrl: '',
        duration: 240,
        learningPathId: 2,
        order: i + 1,
        isActive: true
      })),
      3: Array.from({length: 10}, (_, i) => ({
        id: i + 31,
        title: `Module ${i + 1}`,
        description: `AI/ML module ${i + 1}`,
        contentType: 'video',
        contentUrl: '',
        duration: 180,
        learningPathId: 3,
        order: i + 1,
        isActive: true
      })),
      4: Array.from({length: 14}, (_, i) => ({
        id: i + 41,
        title: `Module ${i + 1}`,
        description: `DevOps module ${i + 1}`,
        contentType: 'video',
        contentUrl: '',
        duration: 150,
        learningPathId: 4,
        order: i + 1,
        isActive: true
      }))
    };

    this.applyFilters();
  }

  loadUserProgress(): void {
    // Load from localStorage or backend
    const savedProgress = localStorage.getItem('learningProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      this.enrolledPaths = progress.enrolledPaths || [];
      this.pathProgress = progress.pathProgress || {};
    }
  }

  applyFilters(): void {
    let filtered = [...this.learningPaths];

    // Search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(path => 
        path.title.toLowerCase().includes(searchTerm) ||
        path.description.toLowerCase().includes(searchTerm) ||
        path.learningObjectives.some(obj => obj.toLowerCase().includes(searchTerm))
      );
    }

    // Level filter
    const levels = this.levelFilter.value as string[] || [];
    if (levels.length > 0) {
      filtered = filtered.filter(path => levels.includes(path.level.toLowerCase()));
    }

    // Duration filter
    const duration = this.durationFilter.value;
    if (duration) {
      filtered = filtered.filter(path => {
        switch (duration) {
          case 'short': return path.duration < 10;
          case 'medium': return path.duration >= 10 && path.duration <= 30;
          case 'long': return path.duration > 30;
          default: return true;
        }
      });
    }

    this.filteredPaths = filtered;
  }

  isEnrolled(pathId: number): boolean {
    return this.enrolledPaths.includes(pathId);
  }

  getProgress(pathId: number): number {
    return this.pathProgress[pathId] || 0;
  }

  getContentCount(pathId: number): number {
    return this.pathContents[pathId]?.length || 0;
  }

  getCompletedModules(pathId: number): number {
    const progress = this.getProgress(pathId);
    const totalModules = this.getContentCount(pathId);
    return Math.round((progress / 100) * totalModules);
  }

  getPathTitle(pathId: number): string {
    const path = this.learningPaths.find(p => p.id === pathId);
    return path?.title || '';
  }

  getPathById(pathId: number): LearningPath | undefined {
    return this.learningPaths.find(p => p.id === pathId);
  }

  enrollInPath(path: LearningPath): void {
    if (!this.isEnrolled(path.id)) {
      this.enrolledPaths.push(path.id);
      this.pathProgress[path.id] = 0;
      this.saveProgress();
      this.snackBar.open(`Enrolled in "${path.title}"!`, 'Close', { duration: 3000 });
    }
  }

  continuePath(path: LearningPath | undefined): void {
    if (path) {
      // Navigate to learning content or open learning interface
      this.snackBar.open(`Continuing "${path.title}"...`, 'Close', { duration: 2000 });
      // In a real app, navigate to the learning content
      // this.router.navigate(['/learn', path.id]);
    }
  }

  viewPathDetails(path: LearningPath): void {
    // Open detailed view or modal
    this.snackBar.open(`Viewing details for "${path.title}"`, 'Close', { duration: 2000 });
    // In a real app, open a detailed modal or navigate to details page
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.levelFilter.setValue([]);
    this.durationFilter.setValue('');
    this.applyFilters();
  }

  getLevelIcon(level: string): string {
    switch (level.toLowerCase()) {
      case 'beginner': return 'play_circle';
      case 'intermediate': return 'school';
      case 'advanced': return 'workspace_premium';
      default: return 'school';
    }
  }

  private saveProgress(): void {
    const progress = {
      enrolledPaths: this.enrolledPaths,
      pathProgress: this.pathProgress
    };
    localStorage.setItem('learningProgress', JSON.stringify(progress));
  }
}
