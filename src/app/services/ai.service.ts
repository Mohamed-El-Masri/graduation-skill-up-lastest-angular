import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import{AIConversation}from '../models/aiconversation';
import{AIMessage}from '../models/aimessage';
import{ChatRequest}from '../models/chat-request';
import{SkillAnalysisRequest}from '../models/skill-analysis-request';
import{SkillAnalysisResult}from '../models/skill-analysis-result';
import{CareerRecommendationRequest}from '../models/career-recommendation-request';
import{CareerRecommendation}from '../models/career-recommendation';
import {ApiResponse} from '../models/api-response';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = `${environment.apiUrl}/EnhancedAI`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  chatWithAssistant(request: ChatRequest): Observable<{ response: string }> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<{ response: string }>(`${this.apiUrl}/chat`, request, { headers });
  }

  analyzeSkills(request: SkillAnalysisRequest): Observable<SkillAnalysisResult> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<SkillAnalysisResult>(`${this.apiUrl}/analyze-skills`, request, { headers });
  }

  recommendCareers(request: CareerRecommendationRequest): Observable<CareerRecommendation[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<CareerRecommendation[]>(`${this.apiUrl}/recommend-careers`, request, { headers });
  }

  getInterviewTips(jobTitle: string): Observable<{ tips: string }> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<{ tips: string }>(`${this.apiUrl}/interview-tips`, { templateId: jobTitle }, { headers });
  }

  getConversations(pageNumber: number = 1, pageSize: number = 20): Observable<AIConversation[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<AIConversation[]>(`${this.apiUrl}/conversations?pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers });
  }

  getConversationMessages(conversationId: number, pageNumber: number = 1, pageSize: number = 50): Observable<AIMessage[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<AIMessage[]>(`${this.apiUrl}/conversations/${conversationId}/messages?pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers });
  }
}
