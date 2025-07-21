import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { AiService } from '../services/ai.service';
import{AIMessage}from '../models/aimessage';
import{ChatRequest}from '../models/chat-request';
import{CareerRecommendationRequest}from '../models/career-recommendation-request';
import{SkillAnalysisRequest}from '../models/skill-analysis-request';


@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTabsModule,
    MatChipsModule,
    MatSnackBarModule,
    MatSelectModule
  ],
  templateUrl:'./ai-chat.component.html',
  styleUrls: ['./ai-chat.component.scss']
})
export class AiChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  chatForm: FormGroup;
  skillAnalysisForm: FormGroup;
  careerForm: FormGroup;
  
  messages: AIMessage[] = [];
  isLoading = false;
  isTyping = false;
  isAnalyzing = false;
  isGettingRecommendations = false;
  analysisCount = 0;
  
  currentSkills: string[] = [];
  analysisResults: any = null;
  careerRecommendations: any[] = [];
  
  quickSuggestions = [
    { text: 'How can I improve my programming skills?', icon: 'code' },
    { text: 'What are the best career paths in technology?', icon: 'trending_up' },
    { text: 'How should I prepare for job interviews?', icon: 'psychology' },
    { text: 'Tips for writing an outstanding resume', icon: 'description' }
  ];

  careerInterests = [
    { name: 'Software Development', icon: 'code', selected: false },
    { name: 'Data Science', icon: 'analytics', selected: false },
    { name: 'UI/UX Design', icon: 'design_services', selected: false },
    { name: 'Project Management', icon: 'business', selected: false },
    { name: 'DevOps', icon: 'cloud', selected: false },
    { name: 'Cybersecurity', icon: 'security', selected: false }
  ];

  constructor(
    private fb: FormBuilder,
    private aiService: AiService,
    private snackBar: MatSnackBar
  ) {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required]]
    });
    
    this.skillAnalysisForm = this.fb.group({
      currentRole: ['', [Validators.required]],
      experience: [0, [Validators.required, Validators.min(0)]],
      targetRole: ['', [Validators.required]]
    });
    
    this.careerForm = this.fb.group({
      workEnvironment: ['', [Validators.required]],
      careerStage: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // Welcome message is handled in the template
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

  sendMessage() {
    if (this.chatForm.valid && !this.isLoading) {
      const message = this.chatForm.value.message.trim();
      if (!message) return;

      // Add user message
      this.messages.push({
        id: this.messages.length + 1,
        conversationId: 1,
        content: message,
        isFromUser: true,
        timestamp: new Date()
      });

      this.chatForm.reset();
      this.isLoading = true;
      this.isTyping = true;

      const request: ChatRequest = { message };

      this.aiService.chatWithAssistant(request).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isTyping = false;
          
          this.messages.push({
            id: this.messages.length + 1,
            conversationId: 1,
            content: response.response,
            isFromUser: false,
            timestamp: new Date()
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.isTyping = false;
          
          this.messages.push({
            id: this.messages.length + 1,
            conversationId: 1,
            content: 'Sorry, there was a connection error. Please try again.',
            isFromUser: false,
            timestamp: new Date()
          });
          
          this.snackBar.open('Connection error with service', 'Close', { duration: 3000 });
        }
      });
    }
  }

  sendQuickMessage(suggestion: any) {
    this.chatForm.patchValue({ message: suggestion.text });
    this.sendMessage();
  }

  performSkillAnalysis() {
    if (this.skillAnalysisForm.valid && !this.isAnalyzing) {
      const formValue = this.skillAnalysisForm.value;
      
      const request: SkillAnalysisRequest = {
        skills: this.currentSkills,
        assessmentResults: []
      };

      this.isAnalyzing = true;
      this.analysisCount++;

      this.aiService.analyzeSkills(request).subscribe({
        next: (response) => {
          this.isAnalyzing = false;
          this.analysisResults = response;
        },
        error: (error) => {
          this.isAnalyzing = false;
          this.snackBar.open('Error analyzing skills', 'Close', { duration: 3000 });
        }
      });
    }
  }

  addSkill(skill: string) {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !this.currentSkills.includes(trimmedSkill)) {
      this.currentSkills.push(trimmedSkill);
    }
  }

  removeSkill(index: number) {
    this.currentSkills.splice(index, 1);
  }

  toggleInterest(interest: any) {
    interest.selected = !interest.selected;
  }

  getCareerRecommendations() {
    if (this.careerForm.valid && !this.isGettingRecommendations) {
      const selectedInterests = this.careerInterests
        .filter(interest => interest.selected)
        .map(interest => interest.name);
      
      const request: CareerRecommendationRequest = {
        skills: this.currentSkills,
        interests: selectedInterests,
        educationLevel: 'Bachelor',
        experience: '3'
      };

      this.isGettingRecommendations = true;

      this.aiService.recommendCareers(request).subscribe({
        next: (response) => {
          this.isGettingRecommendations = false;
          this.careerRecommendations = response;
        },
        error: (error) => {
          this.isGettingRecommendations = false;
          this.snackBar.open('Error getting career recommendations', 'Close', { duration: 3000 });
        }
      });
    }
  }

  exploreCareerPath(path: any) {
    this.snackBar.open(`Exploring ${path.title} career path...`, 'Close', { duration: 3000 });
  }

  saveCareerPath(path: any) {
    this.snackBar.open(`${path.title} saved to your profile!`, 'Close', { duration: 3000 });
  }

  copyMessage(content: string) {
    navigator.clipboard.writeText(content);
    this.snackBar.open('Message copied to clipboard', 'Close', { duration: 2000 });
  }

  formatMessage(content: string): string {
    // Basic formatting for AI responses
    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}
