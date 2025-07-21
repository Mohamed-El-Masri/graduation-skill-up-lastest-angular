import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('🚀 Outgoing request:', {
      method: req.method,
      url: req.url,
      headers: req.headers.keys().reduce((acc, key) => {
        acc[key] = req.headers.get(key);
        return acc;
      }, {} as any),
      body: req.body
    });

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          console.log('📥 Incoming response:', {
            status: event.status,
            statusText: event.statusText,
            url: event.url,
            body: event.body
          });
        }
      })
    );
  }
}
