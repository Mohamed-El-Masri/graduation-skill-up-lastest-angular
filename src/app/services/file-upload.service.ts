import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileUpload } from '../models/file-upload';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = `${environment.apiUrl}/FileUpload`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  uploadFile(file: File, categoryId?: number, tags?: string[]): Observable<FileUpload> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (categoryId) {
      formData.append('categoryId', categoryId.toString());
    }
    
    if (tags && tags.length > 0) {
      tags.forEach(tag => formData.append('tags', tag));
    }

    const headers = this.authService.getAuthHeaders().delete('Content-Type'); // Let browser set content-type for FormData

    return this.http.post<FileUpload>(`${this.apiUrl}/upload`, formData, { headers });
  }

  getFiles(categoryId?: number, pageNumber: number = 1, pageSize: number = 20): Observable<FileUpload[]> {
    const headers = this.authService.getAuthHeaders();
    let url = `${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }

    return this.http.get<FileUpload[]>(url, { headers });
  }

  getUserFiles(): Observable<FileUpload[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<FileUpload[]>(`${this.apiUrl}/user-files`, { headers });
  }

  deleteFile(id: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  renameFile(id: number, newName: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.patch(`${this.apiUrl}/${id}/rename`, { newName }, { headers });
  }

  downloadFile(fileUrl: string): void {
    window.open(fileUrl, '_blank');
  }
}
