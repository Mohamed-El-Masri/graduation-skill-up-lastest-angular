import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CVTemplate} from '../models/cvtemplate'
import { UserCV} from '../models/user-cv'
import { ApiResponse} from '../models/api-response'
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CvService {
  private apiUrl = `${environment.apiUrl}/CV`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getTemplates(): Observable<CVTemplate[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<CVTemplate[]>(`${this.apiUrl}/templates`, { headers });
  }

  createCV(cvData: Partial<UserCV>): Observable<UserCV> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<UserCV>(`${this.apiUrl}/create`, cvData, { headers });
  }

  updateCV(id: number, cvData: Partial<UserCV>): Observable<UserCV> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<UserCV>(`${this.apiUrl}/${id}`, cvData, { headers });
  }

  getUserCVs(): Observable<UserCV[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<UserCV[]>(`${this.apiUrl}/user-cvs`, { headers });
  }

  getCV(id: number): Observable<UserCV> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<UserCV>(`${this.apiUrl}/${id}`, { headers });
  }

  exportToPDF(id: number): Observable<Blob> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${id}/export-pdf`, {}, { 
      headers, 
      responseType: 'blob' 
    });
  }

  generatePDF(cvData: any): Observable<Blob> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/generate-pdf`, cvData, { 
      headers, 
      responseType: 'blob' 
    });
  }

  deleteCV(id: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
