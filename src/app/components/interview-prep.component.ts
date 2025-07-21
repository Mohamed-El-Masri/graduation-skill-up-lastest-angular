import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { InterviewService } from '../services/interview.service';
import { InterviewQuestion } from '../models/interview-question';

@Component({
  selector: 'app-interview-prep',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatBadgeModule
  ],
  templateUrl: './interview-prep.component.html',
  styleUrls: ['./interview-prep.component.scss']
})
export class InterviewPrepComponent implements OnInit, OnDestroy {
  // Form controls
  categoryFilter = new FormControl([]);
  difficultyFilter = new FormControl([]);

  // Data
  categories: string[] = [
    'Technical', 'Behavioral', 'Problem Solving', 'System Design',
    'Programming', 'Database', 'Algorithms', 'Leadership', 'Communication'
  ];
  
  questions: InterviewQuestion[] = [];
  currentQuestion: InterviewQuestion | null = null;
  currentQuestionIndex = 0;
  userAnswer = '';
  answeredQuestions = new Set<number>();
  showSampleAnswer = false;

  // Mock interview
  mockInterviewActive = false;
  mockInterviewType = 'technical';
  mockInterviewDuration = 30;
  jobPosition = '';
  mockConversation: any[] = [];
  currentResponse = '';
  interviewTimer = 0;
  private timerInterval: any;

  // Progress data
  totalQuestionsAnswered = 0;
  mockInterviewsCompleted = 0;
  averageScore = 0;
  totalPracticeTime = 0;
  recentActivity: any[] = [];

  // Loading states
  loadingQuestions = false;

  constructor(
    private interviewService: InterviewService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProgress();
    this.loadRecentActivity();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  onTabChange(event: any): void {
    const tabIndex = event.index;
    if (tabIndex === 2) { // Progress tab
      this.loadProgress();
    }
  }

  async loadQuestions(): Promise<void> {
    this.loadingQuestions = true;
    try {
      const categories = this.categoryFilter.value || [];
      const difficulties = this.difficultyFilter.value || [];
      
      this.questions = await this.interviewService.getQuestions(categories, difficulties).toPromise() || [];
      if (this.questions.length > 0) {
        this.currentQuestion = this.questions[0];
        this.currentQuestionIndex = 0;
      }
      this.userAnswer = '';
      this.showSampleAnswer = false;
    } catch (error) {
      console.error('Error loading questions:', error);
      this.snackBar.open('Error loading questions. Please try again.', 'Close', { duration: 3000 });
    } finally {
      this.loadingQuestions = false;
    }
  }

  async loadAllQuestions(): Promise<void> {
    this.categoryFilter.setValue([]);
    this.difficultyFilter.setValue([]);
    await this.loadQuestions();
  }

  selectQuestion(index: number): void {
    this.currentQuestionIndex = index;
    this.currentQuestion = this.questions[index];
    this.userAnswer = '';
    this.showSampleAnswer = false;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.selectQuestion(this.currentQuestionIndex + 1);
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.selectQuestion(this.currentQuestionIndex - 1);
    }
  }

  saveAnswer(): void {
    if (this.currentQuestion && this.userAnswer.trim()) {
      this.answeredQuestions.add(this.currentQuestion.id);
      // Save to backend
      this.interviewService.saveAnswer(this.currentQuestion.id, this.userAnswer).subscribe({
        next: () => {
          this.snackBar.open('Answer saved successfully!', 'Close', { duration: 2000 });
          this.totalQuestionsAnswered++;
        },
        error: (error) => {
          console.error('Error saving answer:', error);
          this.snackBar.open('Error saving answer. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  startMockInterview(): void {
    this.mockInterviewActive = true;
    this.mockConversation = [];
    this.interviewTimer = this.mockInterviewDuration * 60; // Convert to seconds
    
    // Start timer
    this.timerInterval = setInterval(() => {
      this.interviewTimer--;
      if (this.interviewTimer <= 0) {
        this.endMockInterview();
      }
    }, 1000);

    // Initial AI greeting
    const greeting = `Hello! I'm your AI interviewer for this ${this.mockInterviewType} interview for the ${this.jobPosition} position. Let's begin. Can you tell me about yourself and why you're interested in this role?`;
    
    this.mockConversation.push({
      content: greeting,
      isFromUser: false,
      timestamp: new Date()
    });
  }

  sendResponse(): void {
    if (this.currentResponse.trim()) {
      this.mockConversation.push({
        content: this.currentResponse,
        isFromUser: true,
        timestamp: new Date()
      });

      // Simulate AI response (in real app, this would call AI service)
      this.generateAIResponse(this.currentResponse);
      this.currentResponse = '';
    }
  }

  private generateAIResponse(userResponse: string): void {
    // Simulate AI processing time
    setTimeout(() => {
      const responses = [
        "That's interesting. Can you give me a specific example of when you demonstrated that skill?",
        "How would you handle a situation where you disagreed with your team lead?",
        "What do you consider your greatest professional achievement and why?",
        "How do you stay updated with the latest technologies in your field?",
        "Can you walk me through your problem-solving process?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      this.mockConversation.push({
        content: randomResponse,
        isFromUser: false,
        timestamp: new Date()
      });
    }, 1000);
  }

  endMockInterview(): void {
    this.mockInterviewActive = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.mockInterviewsCompleted++;
    
    this.snackBar.open('Mock interview completed! Great job!', 'Close', { duration: 3000 });
    
    // Save interview session
    this.interviewService.saveMockInterview({
      type: this.mockInterviewType,
      position: this.jobPosition,
      duration: this.mockInterviewDuration,
      conversation: this.mockConversation
    }).subscribe();
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  private loadProgress(): void {
    this.interviewService.getProgress().subscribe({
      next: (progress) => {
        this.totalQuestionsAnswered = progress.totalQuestionsAnswered || 0;
        this.mockInterviewsCompleted = progress.mockInterviewsCompleted || 0;
        this.averageScore = progress.averageScore || 0;
        this.totalPracticeTime = progress.totalPracticeTime || 0;
      },
      error: (error) => {
        console.error('Error loading progress:', error);
      }
    });
  }

  private loadRecentActivity(): void {
    this.recentActivity = [
      {
        type: 'question',
        icon: 'quiz',
        title: 'Answered Technical Question',
        description: 'Completed a hard-level algorithm question',
        date: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
      },
      {
        type: 'interview',
        icon: 'video_call',
        title: 'Mock Interview Completed',
        description: 'Finished a 30-minute behavioral interview session',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
      },
      {
        type: 'achievement',
        icon: 'star',
        title: 'Achievement Unlocked',
        description: 'Answered 50 questions milestone reached',
        date: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
      }
    ];
  }
}
