import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './services/auth.service';
import { User } from './models/user';
import { NotificationsComponent } from './components/notifications.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    NotificationsComponent
],
  templateUrl:'./app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  
  currentUser$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.isAuthenticated$ = this.authService.currentUser$.pipe(
      map(user => !!user)
    );
  }

  ngOnInit() {
    // Check if user is already logged in on app initialization
    console.log('App initializing...');
    const token = this.authService.getToken();
    const user = this.authService.getCurrentUser();
    
    console.log('Token exists:', !!token);
    console.log('User exists:', !!user);
    console.log('Is authenticated:', this.authService.isAuthenticated());
    
    if (token && user && this.authService.isAuthenticated()) {
      console.log('User authenticated, setting current user');
      // Use a type assertion to access the private property safely
      (this.authService as any)['currentUserSubject'].next(user);
    } else {
      console.log('User not authenticated, clearing auth data');
      // Clear any invalid data
      this.authService.clearAuthDataPublic();
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Logout successful, redirect handled by AuthService
      },
      error: () => {
        // Even if server logout fails, user is logged out locally
      }
    });
  }
}
