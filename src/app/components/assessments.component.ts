import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: any): any[] {
    if (!items) return [];
    if (!field || value === undefined) return items;
    
    return items.filter(item => item[field] === value);
  }
}

interface Assessment {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // in minutes
  questionsCount: number;
  isCompleted: boolean;
  score?: number;
  completedAt?: Date;
  tags: string[];
}

interface AssessmentResult {
  id: number;
  assessmentId: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: Date;
  timeSpent: number;
  feedback: string;
}

@Component({
  selector: 'app-assessments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatTabsModule,
    MatDialogModule,
    MatSnackBarModule,
    FilterPipe
  ],
  templateUrl: './assessments.component.html',
  styleUrl: './assessments.component.scss'
})
export class AssessmentsComponent implements OnInit {
  assessments: Assessment[] = [];
  completedAssessments: AssessmentResult[] = [];
  selectedCategory = 'all';
  selectedDifficulty = 'all';
  isLoading = false;

  categories = ['all', 'Programming', 'Soft Skills', 'Technical', 'Design', 'Management'];
  difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadAssessments();
    this.loadAssessmentResults();
  }

  loadAssessments() {
    this.isLoading = true;
    
    // Mock data - replace with actual API call
    const mockAssessments: Assessment[] = [
      {
        id: 1,
        title: 'JavaScript Fundamentals',
        description: 'Test your knowledge of JavaScript basics including variables, functions, and DOM manipulation.',
        category: 'Programming',
        difficulty: 'Beginner',
        duration: 30,
        questionsCount: 25,
        isCompleted: false,
        tags: ['JavaScript', 'Web Development', 'Frontend']
      },
      {
        id: 2,
        title: 'Angular Advanced Concepts',
        description: 'Deep dive into Angular services, routing, and state management.',
        category: 'Programming',
        difficulty: 'Advanced',
        duration: 45,
        questionsCount: 30,
        isCompleted: true,
        score: 85,
        completedAt: new Date('2024-01-15'),
        tags: ['Angular', 'TypeScript', 'Frontend']
      },
      {
        id: 3,
        title: 'Communication Skills',
        description: 'Assess your professional communication and presentation abilities.',
        category: 'Soft Skills',
        difficulty: 'Intermediate',
        duration: 20,
        questionsCount: 15,
        isCompleted: false,
        tags: ['Communication', 'Presentation', 'Leadership']
      },
      {
        id: 4,
        title: 'Database Design',
        description: 'Test your understanding of database design principles and SQL.',
        category: 'Technical',
        difficulty: 'Intermediate',
        duration: 40,
        questionsCount: 35,
        isCompleted: true,
        score: 92,
        completedAt: new Date('2024-01-10'),
        tags: ['SQL', 'Database', 'Backend']
      },
      {
        id: 5,
        title: 'UI/UX Design Principles',
        description: 'Evaluate your knowledge of design thinking and user experience.',
        category: 'Design',
        difficulty: 'Beginner',
        duration: 25,
        questionsCount: 20,
        isCompleted: false,
        tags: ['Design', 'UX', 'UI']
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      this.assessments = mockAssessments;
      this.isLoading = false;
    }, 1000);

    // TODO: Replace with actual API call
    // this.http.get<Assessment[]>('/api/assessments').pipe(
    //   catchError(error => {
    //     this.snackBar.open('Error loading assessments', 'Close', { duration: 3000 });
    //     return of([]);
    //   })
    // ).subscribe(assessments => {
    //   this.assessments = assessments;
    //   this.isLoading = false;
    // });
  }

  loadAssessmentResults() {
    // Mock data - replace with actual API call
    const mockResults: AssessmentResult[] = [
      {
        id: 1,
        assessmentId: 2,
        score: 85,
        totalQuestions: 30,
        correctAnswers: 26,
        completedAt: new Date('2024-01-15'),
        timeSpent: 42,
        feedback: 'Great job! You have a solid understanding of Angular concepts.'
      },
      {
        id: 2,
        assessmentId: 4,
        score: 92,
        totalQuestions: 35,
        correctAnswers: 32,
        completedAt: new Date('2024-01-10'),
        timeSpent: 38,
        feedback: 'Excellent! Your database design skills are impressive.'
      }
    ];

    this.completedAssessments = mockResults;

    // TODO: Replace with actual API call
    // this.http.get<AssessmentResult[]>('/api/assessment-results').subscribe(results => {
    //   this.completedAssessments = results;
    // });
  }

  get filteredAssessments() {
    return this.assessments.filter(assessment => {
      const categoryMatch = this.selectedCategory === 'all' || assessment.category === this.selectedCategory;
      const difficultyMatch = this.selectedDifficulty === 'all' || assessment.difficulty === this.selectedDifficulty;
      return categoryMatch && difficultyMatch;
    });
  }

  startAssessment(assessment: Assessment) {
    // TODO: Navigate to assessment taking component or open dialog
    this.snackBar.open(`Starting ${assessment.title}...`, 'Close', { duration: 2000 });
    
    // Mock completion for demo
    setTimeout(() => {
      assessment.isCompleted = true;
      assessment.score = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
      assessment.completedAt = new Date();
      this.snackBar.open('Assessment completed!', 'Close', { duration: 3000 });
    }, 2000);
  }

  retakeAssessment(assessment: Assessment) {
    assessment.isCompleted = false;
    assessment.score = undefined;
    assessment.completedAt = undefined;
    this.startAssessment(assessment);
  }

  viewResults(assessment: Assessment) {
    const result = this.completedAssessments.find(r => r.assessmentId === assessment.id);
    if (result) {
      // TODO: Open results dialog or navigate to results page
      this.snackBar.open(`Score: ${result.score}% - ${result.feedback}`, 'Close', { duration: 5000 });
    }
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Beginner': return 'primary';
      case 'Intermediate': return 'accent';
      case 'Advanced': return 'warn';
      default: return 'primary';
    }
  }

  getScoreColor(score: number): string {
    if (score >= 90) return 'success';
    if (score >= 70) return 'primary';
    if (score >= 50) return 'accent';
    return 'warn';
  }
}
