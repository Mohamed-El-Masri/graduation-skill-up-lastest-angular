import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterviewQuestion } from '../models/interview-question';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private apiUrl = `${environment.apiUrl}/Interview`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getQuestions(categories: string[], difficulties: string[]): Observable<InterviewQuestion[]> {
    const headers = this.authService.getAuthHeaders();
    let url = `${this.apiUrl}/questions`;
    
    const params: string[] = [];
    if (categories.length > 0) {
      categories.forEach(cat => params.push(`category=${encodeURIComponent(cat)}`));
    }
    if (difficulties.length > 0) {
      difficulties.forEach(diff => params.push(`difficulty=${encodeURIComponent(diff)}`));
    }
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    return this.http.get<InterviewQuestion[]>(url, { headers });
  }

  getQuestionsByJobTitle(jobTitle: string): Observable<InterviewQuestion[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<InterviewQuestion[]>(`${this.apiUrl}/questions/job/${encodeURIComponent(jobTitle)}`, { headers });
  }

  getRandomQuestions(count: number = 10, category?: string): Observable<InterviewQuestion[]> {
    const headers = this.authService.getAuthHeaders();
    let url = `${this.apiUrl}/questions/random?count=${count}`;
    
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }

    return this.http.get<InterviewQuestion[]>(url, { headers });
  }

  submitAnswer(questionId: number, answer: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/submit-answer`, {
      questionId,
      answer
    }, { headers });
  }

  saveAnswer(questionId: number, answer: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/save-answer`, {
      questionId,
      answer
    }, { headers });
  }

  saveMockInterview(interviewData: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/mock-interview`, interviewData, { headers });
  }

  getProgress(): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/progress`, { headers });
  }

  getUserInterviewHistory(): Observable<any[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/user-history`, { headers });
  }
}
