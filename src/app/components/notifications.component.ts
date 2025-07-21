import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';

import { NotificationService, Notification } from '../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="notifications-container">
      <div 
        *ngFor="let notification of notifications" 
        class="notification"
        [ngClass]="'notification-' + notification.type"
      >
        <div class="notification-content">
          <mat-icon class="notification-icon">{{ getNotificationIcon(notification.type) }}</mat-icon>
          <div class="notification-text">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
          </div>
          <button 
            mat-icon-button 
            class="close-button"
            (click)="removeNotification(notification.id)"
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      max-width: 400px;
      width: 100%;
    }

    .notification {
      margin-bottom: 12px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .notification-content {
      display: flex;
      align-items: flex-start;
      padding: 16px;
      gap: 12px;
    }

    .notification-icon {
      flex-shrink: 0;
      font-size: 24px;
      height: 24px;
      width: 24px;
    }

    .notification-text {
      flex: 1;
      min-width: 0;
    }

    .notification-title {
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 4px;
      color: inherit;
    }

    .notification-message {
      font-size: 13px;
      line-height: 1.4;
      color: inherit;
      opacity: 0.9;
    }

    .close-button {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      margin: -8px -8px -8px 0;
    }

    .close-button mat-icon {
      font-size: 18px;
      height: 18px;
      width: 18px;
    }

    /* Success notification */
    .notification-success {
      background-color: #4caf50;
      color: white;
    }

    .notification-success .notification-icon {
      color: white;
    }

    .notification-success .close-button {
      color: white;
    }

    /* Error notification */
    .notification-error {
      background-color: #f44336;
      color: white;
    }

    .notification-error .notification-icon {
      color: white;
    }

    .notification-error .close-button {
      color: white;
    }

    /* Warning notification */
    .notification-warning {
      background-color: #ff9800;
      color: white;
    }

    .notification-warning .notification-icon {
      color: white;
    }

    .notification-warning .close-button {
      color: white;
    }

    /* Info notification */
    .notification-info {
      background-color: #2196f3;
      color: white;
    }

    .notification-info .notification-icon {
      color: white;
    }

    .notification-info .close-button {
      color: white;
    }

    @media (max-width: 480px) {
      .notifications-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }
    }
  `]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.getNotifications().subscribe(
      notifications => {
        this.notifications = notifications;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeNotification(id: string): void {
    this.notificationService.remove(id);
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'notifications';
    }
  }
}
