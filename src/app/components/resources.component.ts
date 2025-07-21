import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Resource {
  id: number;
  title: string;
  description: string;
  type: 'Article' | 'Video' | 'Course' | 'Book' | 'Documentation' | 'Tool';
  category: string;
  url: string;
  author: string;
  publishedDate: Date;
  duration?: number; // for videos/courses in minutes
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  rating: number;
  reviewsCount: number;
  isFavorite: boolean;
  isBookmarked: boolean;
  thumbnail?: string;
}

interface ResourceCategory {
  name: string;
  icon: string;
  count: number;
}

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss'
})
export class ResourcesComponent implements OnInit {
  resources: Resource[] = [];
  filteredResources: Resource[] = [];
  categories: ResourceCategory[] = [];
  selectedCategory = 'all';
  selectedType = 'all';
  selectedDifficulty = 'all';
  searchQuery = '';
  isLoading = false;

  resourceTypes = ['all', 'Article', 'Video', 'Course', 'Book', 'Documentation', 'Tool'];
  difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadResources();
    this.loadCategories();
  }

  loadResources() {
    this.isLoading = true;
    
    // Mock data - replace with actual API call
    const mockResources: Resource[] = [
      {
        id: 1,
        title: 'Angular Complete Guide',
        description: 'Comprehensive guide to Angular development from basics to advanced concepts.',
        type: 'Course',
        category: 'Frontend Development',
        url: 'https://example.com/angular-guide',
        author: 'Angular Team',
        publishedDate: new Date('2024-01-15'),
        duration: 480,
        difficulty: 'Intermediate',
        tags: ['Angular', 'TypeScript', 'Web Development'],
        rating: 4.8,
        reviewsCount: 1250,
        isFavorite: true,
        isBookmarked: false,
        thumbnail: 'assets/images/angular-course.jpg'
      },
      {
        id: 2,
        title: 'JavaScript Design Patterns',
        description: 'Learn essential design patterns in JavaScript for better code organization.',
        type: 'Article',
        category: 'Programming',
        url: 'https://example.com/js-patterns',
        author: 'John Doe',
        publishedDate: new Date('2024-01-10'),
        difficulty: 'Advanced',
        tags: ['JavaScript', 'Design Patterns', 'Software Architecture'],
        rating: 4.5,
        reviewsCount: 680,
        isFavorite: false,
        isBookmarked: true
      },
      {
        id: 3,
        title: 'CSS Grid Layout Tutorial',
        description: 'Master CSS Grid layout with practical examples and real-world projects.',
        type: 'Video',
        category: 'Web Design',
        url: 'https://example.com/css-grid',
        author: 'CSS Tricks',
        publishedDate: new Date('2024-01-08'),
        duration: 120,
        difficulty: 'Beginner',
        tags: ['CSS', 'Grid', 'Layout', 'Responsive Design'],
        rating: 4.7,
        reviewsCount: 890,
        isFavorite: false,
        isBookmarked: false
      },
      {
        id: 4,
        title: 'Node.js Best Practices',
        description: 'Collection of best practices for Node.js development and deployment.',
        type: 'Documentation',
        category: 'Backend Development',
        url: 'https://example.com/nodejs-practices',
        author: 'Node.js Foundation',
        publishedDate: new Date('2024-01-05'),
        difficulty: 'Intermediate',
        tags: ['Node.js', 'Best Practices', 'Backend', 'JavaScript'],
        rating: 4.9,
        reviewsCount: 1560,
        isFavorite: true,
        isBookmarked: true
      },
      {
        id: 5,
        title: 'Clean Code: A Handbook',
        description: 'Essential principles for writing clean, maintainable code.',
        type: 'Book',
        category: 'Software Engineering',
        url: 'https://example.com/clean-code',
        author: 'Robert C. Martin',
        publishedDate: new Date('2023-12-20'),
        difficulty: 'Intermediate',
        tags: ['Clean Code', 'Software Engineering', 'Best Practices'],
        rating: 4.8,
        reviewsCount: 2340,
        isFavorite: false,
        isBookmarked: false
      },
      {
        id: 6,
        title: 'VS Code Extension Development',
        description: 'Learn how to create powerful VS Code extensions.',
        type: 'Tool',
        category: 'Development Tools',
        url: 'https://example.com/vscode-extensions',
        author: 'Microsoft',
        publishedDate: new Date('2024-01-12'),
        difficulty: 'Advanced',
        tags: ['VS Code', 'Extensions', 'Development Tools'],
        rating: 4.6,
        reviewsCount: 420,
        isFavorite: false,
        isBookmarked: true
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      this.resources = mockResources;
      this.applyFilters();
      this.isLoading = false;
    }, 1000);

    // TODO: Replace with actual API call
    // this.http.get<Resource[]>('/api/resources').pipe(
    //   catchError(error => {
    //     this.snackBar.open('Error loading resources', 'Close', { duration: 3000 });
    //     return of([]);
    //   })
    // ).subscribe(resources => {
    //   this.resources = resources;
    //   this.applyFilters();
    //   this.isLoading = false;
    // });
  }

  loadCategories() {
    // Mock data - replace with actual API call
    this.categories = [
      { name: 'Frontend Development', icon: 'web', count: 25 },
      { name: 'Backend Development', icon: 'storage', count: 18 },
      { name: 'Web Design', icon: 'design_services', count: 15 },
      { name: 'Programming', icon: 'code', count: 32 },
      { name: 'Software Engineering', icon: 'engineering', count: 12 },
      { name: 'Development Tools', icon: 'build', count: 8 },
      { name: 'Data Science', icon: 'analytics', count: 14 },
      { name: 'Mobile Development', icon: 'phone_android', count: 10 }
    ];
  }

  applyFilters() {
    this.filteredResources = this.resources.filter(resource => {
      const categoryMatch = this.selectedCategory === 'all' || resource.category === this.selectedCategory;
      const typeMatch = this.selectedType === 'all' || resource.type === this.selectedType;
      const difficultyMatch = this.selectedDifficulty === 'all' || resource.difficulty === this.selectedDifficulty;
      const searchMatch = this.searchQuery === '' || 
        resource.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(this.searchQuery.toLowerCase()));
      
      return categoryMatch && typeMatch && difficultyMatch && searchMatch;
    });
  }

  onFilterChange() {
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  toggleFavorite(resource: Resource) {
    resource.isFavorite = !resource.isFavorite;
    const message = resource.isFavorite ? 'Added to favorites' : 'Removed from favorites';
    this.snackBar.open(message, 'Close', { duration: 2000 });
    
    // TODO: Update favorite status on backend
    // this.http.post(`/api/resources/${resource.id}/favorite`, { isFavorite: resource.isFavorite })
    //   .subscribe();
  }

  toggleBookmark(resource: Resource) {
    resource.isBookmarked = !resource.isBookmarked;
    const message = resource.isBookmarked ? 'Bookmarked' : 'Removed bookmark';
    this.snackBar.open(message, 'Close', { duration: 2000 });
    
    // TODO: Update bookmark status on backend
    // this.http.post(`/api/resources/${resource.id}/bookmark`, { isBookmarked: resource.isBookmarked })
    //   .subscribe();
  }

  openResource(resource: Resource) {
    // TODO: Track resource view
    // this.http.post(`/api/resources/${resource.id}/view`, {}).subscribe();
    
    window.open(resource.url, '_blank');
  }

  shareResource(resource: Resource) {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: resource.url
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(resource.url).then(() => {
        this.snackBar.open('Link copied to clipboard', 'Close', { duration: 2000 });
      });
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'Article': return 'article';
      case 'Video': return 'play_circle_filled';
      case 'Course': return 'school';
      case 'Book': return 'menu_book';
      case 'Documentation': return 'description';
      case 'Tool': return 'build';
      default: return 'link';
    }
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Beginner': return 'primary';
      case 'Intermediate': return 'accent';
      case 'Advanced': return 'warn';
      default: return 'primary';
    }
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }
}
