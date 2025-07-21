import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-content-creator',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './content-creator.html',
  styleUrl: './content-creator.scss'
})
export class ContentCreator {
  searchTerm: string = '';

  courses = [
    {
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of HTML, CSS, and JavaScript',
      progress: 70,
      students: 1500,
      lessons: 12,
      quizzes: 5,
      color: '#7E57C2'
    },
    {
      title: 'Angular Basics',
      description: 'Understand components, modules, and services in Angular',
      progress: 45,
      students: 900,
      lessons: 8,
      quizzes: 3,
      color: '#5E35B1'
    },
    {
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of HTML, CSS, and JavaScript',
      progress: 70,
      students: 1500,
      lessons: 12,
      quizzes: 5,
      color: '#7E57C2'
    },
    {
      title: 'Angular Basics',
      description: 'Understand components, modules, and services in Angular',
      progress: 45,
      students: 900,
      lessons: 8,
      quizzes: 3,
      color: '#5E35B1'
    },
    {
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of HTML, CSS, and JavaScript',
      progress: 70,
      students: 1500,
      lessons: 12,
      quizzes: 5,
      color: '#7E57C2'
    },
    {
      title: 'Angular Basics',
      description: 'Understand components, modules, and services in Angular',
      progress: 45,
      students: 900,
      lessons: 8,
      quizzes: 3,
      color: '#5E35B1'
    }
  ];

  get filteredCourses() {
    if (!this.searchTerm) return this.courses;
    const term = this.searchTerm.toLowerCase();
    return this.courses.filter(course =>
      course.title.toLowerCase().includes(term) ||
      course.description.toLowerCase().includes(term)
    );
  }

  engagementView: 'week' | 'month' | 'year' = 'week';

  setView(view: 'week' | 'month' | 'year') {
    this.engagementView = view;
    this.updateChartData();
  }

  getEngagementData() {
    return {
      week: [10, 20, 30, 40, 50, 60, 70],
      month: [100, 200, 300, 400],
      year: [1000, 2000, 3000]
    }[this.engagementView];
  }

  getEngagementLabels() {
    return {
      week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      month: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      year: ['Q1', 'Q2', 'Q3']
    }[this.engagementView];
  }

  getEngagementTitle() {
    return {
      week: 'Weekly Engagement',
      month: 'Monthly Engagement',
      year: 'Yearly Engagement'
    }[this.engagementView];
  }

  getEngagementSubtitle() {
    return {
      week: 'Engagement over the last week',
      month: 'Engagement over the last month',
      year: 'Engagement over the last year'
    }[this.engagementView];
  }

  // Chart setup
  chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Engagement',
        fill: true,
        borderColor: '#7E57C2',
        backgroundColor: 'rgba(126, 87, 194, 0.2)',
        tension: 0.4
      }
    ]
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true
      }
    }
  };

  ngOnInit() {
    this.updateChartData();
  }

  updateChartData() {
    this.chartData.labels = this.getEngagementLabels();
    this.chartData.datasets[0].data = this.getEngagementData();
  }

  activities = [
    {
      icon: 'edit',
      description: 'Update Angular course content',
      time: '2 minutes ago'
    },
    {
      icon: 'add_circle',
      description: 'Added new lesson to Web Development course',
      time: '5 hours ago'
    },
    {
      icon: 'verified',
      description: 'Accepate new student enrollment',
      time: '1 day ago'
    }
  ];
}
