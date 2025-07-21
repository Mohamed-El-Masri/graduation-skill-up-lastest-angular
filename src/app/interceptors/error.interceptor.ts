import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Client Error: ${error.error.message}`;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = this.extractServerMessage(error) || 'Bad Request';
              break;
            case 401:
              errorMessage = 'Unauthorized - Please login';
              break;
            case 403:
              errorMessage = 'Forbidden - Access denied';
              break;
            case 404:
              errorMessage = 'Resource not found';
              break;
            case 409:
              errorMessage = this.extractServerMessage(error) || 'Conflict - Resource already exists';
              break;
            case 422:
              errorMessage = this.extractServerMessage(error) || 'Validation error';
              break;
            case 500:
              errorMessage = 'Internal Server Error';
              break;
            default:
              errorMessage = `Server Error: ${error.status} - ${error.message}`;
          }
        }

        console.error('HTTP Error:', {
          status: error.status,
          message: errorMessage,
          error: error.error
        });

        return throwError(() => ({
          ...error,
          userMessage: errorMessage
        }));
      })
    );
  }

  private extractServerMessage(error: HttpErrorResponse): string | null {
    if (error.error) {
      // Try different message properties that might exist
      if (typeof error.error === 'string') {
        return error.error;
      }
      
      if (error.error.message) {
        return error.error.message;
      }
      
      if (error.error.title) {
        return error.error.title;
      }
      
      if (error.error.errors) {
        if (Array.isArray(error.error.errors)) {
          return error.error.errors.join(', ');
        }
        
        if (typeof error.error.errors === 'object') {
          const errorMessages = Object.values(error.error.errors).flat();
          return errorMessages.join(', ');
        }
      }
    }
    
    return null;
  }
}
