import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-content">
        <mat-icon class="unauthorized-icon">block</mat-icon>
        <h1>غير مخول</h1>
        <p>عذراً، ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="goBack()">
            العودة
          </button>
          <button mat-stroked-button (click)="goHome()">
            الصفحة الرئيسية
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .unauthorized-content {
      background: white;
      border-radius: 12px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
      max-width: 400px;
      width: 100%;
    }

    .unauthorized-icon {
      font-size: 72px;
      height: 72px;
      width: 72px;
      color: #f44336;
      margin-bottom: 20px;
    }

    h1 {
      color: #333;
      margin-bottom: 16px;
      font-size: 28px;
      font-weight: 600;
    }

    p {
      color: #666;
      margin-bottom: 30px;
      font-size: 16px;
      line-height: 1.5;
    }

    .actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .actions button {
      min-width: 120px;
    }

    @media (max-width: 480px) {
      .actions {
        flex-direction: column;
      }
      
      .actions button {
        width: 100%;
      }
    }
  `]
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goBack(): void {
    window.history.back();
  }

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }
}
