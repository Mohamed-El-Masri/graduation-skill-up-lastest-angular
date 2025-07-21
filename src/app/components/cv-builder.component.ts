import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CvService } from '../services/cv.service';
import{CV}from '../models/cv';
import{WorkExperience}from '../models/work-experience';
import{Education}from '../models/education';
import{Skill}from '../models/skill';

@Component({
  selector: 'app-cv-builder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl:'./cv-builder.component.html',
  styleUrls: ['./cv-builder.component.scss']
})
export class CvBuilderComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  
  personalInfoForm!: FormGroup;
  workExperienceForm!: FormGroup;
  educationForm!: FormGroup;
  skillsForm!: FormGroup;
  
  currentStep = 0;
  skillsList: string[] = [];
  suggestedSkills: string[] = [
    'JavaScript', 'TypeScript', 'Angular', 'React', 'Vue.js', 'Node.js',
    'Python', 'Java', 'C#', 'SQL', 'MongoDB', 'Git', 'Docker',
    'Communication', 'Leadership', 'Problem Solving', 'Team Work'
  ];
  
  cvPreview: any = null;
  isGenerating = false;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private cvService: CvService,
    private snackBar: MatSnackBar
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.initializeForms();
    this.loadUserCV();
  }

  onStepChange(event: any): void {
    this.currentStep = event.selectedIndex;
  }

  initializeForms(): void {
    this.personalInfoForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      location: [''],
      summary: [''],
      linkedInUrl: ['']
    });

    this.workExperienceForm = this.fb.group({
      experiences: this.fb.array([this.createExperienceGroup()])
    });

    this.educationForm = this.fb.group({
      educations: this.fb.array([this.createEducationGroup()])
    });

    this.skillsForm = this.fb.group({});

    // Update preview when forms change
    this.personalInfoForm.valueChanges.subscribe(() => this.updatePreview());
    this.workExperienceForm.valueChanges.subscribe(() => this.updatePreview());
    this.educationForm.valueChanges.subscribe(() => this.updatePreview());
  }

  get experiences(): FormArray {
    return this.workExperienceForm.get('experiences') as FormArray;
  }

  get educations(): FormArray {
    return this.educationForm.get('educations') as FormArray;
  }

  createExperienceGroup(): FormGroup {
    return this.fb.group({
      jobTitle: ['', Validators.required],
      company: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      description: ['']
    });
  }

  createEducationGroup(): FormGroup {
    return this.fb.group({
      degree: ['', Validators.required],
      institution: ['', Validators.required],
      startYear: ['', Validators.required],
      endYear: [''],
      gpa: ['']
    });
  }

  addExperience(): void {
    this.experiences.push(this.createExperienceGroup());
  }

  removeExperience(index: number): void {
    this.experiences.removeAt(index);
  }

  addEducation(): void {
    this.educations.push(this.createEducationGroup());
  }

  removeEducation(index: number): void {
    this.educations.removeAt(index);
  }

  addSkill(skill: string): void {
    if (skill && skill.trim() && !this.skillsList.includes(skill.trim())) {
      this.skillsList.push(skill.trim());
      this.updatePreview();
    }
  }

  removeSkill(index: number): void {
    this.skillsList.splice(index, 1);
    this.updatePreview();
  }

  updatePreview(): void {
    this.cvPreview = {
      ...this.personalInfoForm.value,
      workExperiences: this.workExperienceForm.value.experiences,
      educations: this.educationForm.value.educations,
      skills: this.skillsList
    };
  }

  formatDate(date: any): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  async loadUserCV(): Promise<void> {
    try {
      const userCVs = await this.cvService.getUserCVs().toPromise();
      if (userCVs && userCVs.length > 0) {
        const latestCV = userCVs[0];
        // Map UserCV to CV format for populateFormsWithCV
        const cvData: CV = {
          id: latestCV.id,
          userId: latestCV.userId,
          templateId: latestCV.templateId,
          title: latestCV.title,
          fullName: latestCV.personalInfo?.fullName || '',
          email: latestCV.personalInfo?.email || '',
          phone: latestCV.personalInfo?.phone || '',
          location: latestCV.personalInfo?.address || '',
          summary: latestCV.personalInfo?.summary || '',
          workExperiences: latestCV.workExperience || [],
          educations: latestCV.education || [],
          skills: latestCV.skills || [],
          languages: latestCV.languages || [],
          certifications: latestCV.certifications || [],
          references: latestCV.references || [],
          createdAt: latestCV.createdAt,
          updatedAt: latestCV.updatedAt
        };
        this.populateFormsWithCV(cvData);
      }
    } catch (error) {
      console.error('Error loading CV:', error);
    }
  }

  populateFormsWithCV(cv: CV): void {
    this.personalInfoForm.patchValue({
      fullName: cv.fullName,
      email: cv.email,
      phone: cv.phone,
      location: cv.location,
      summary: cv.summary,
      linkedInUrl: cv.linkedInUrl
    });

    // Clear and populate work experiences
    while (this.experiences.length > 0) {
      this.experiences.removeAt(0);
    }
    cv.workExperiences?.forEach((exp: WorkExperience) => {
      this.experiences.push(this.fb.group({
        jobTitle: [exp.position],
        company: [exp.company],
        startDate: [exp.startDate],
        endDate: [exp.endDate],
        description: [exp.description]
      }));
    });

    // Clear and populate educations
    while (this.educations.length > 0) {
      this.educations.removeAt(0);
    }
    cv.educations?.forEach((edu: Education) => {
      this.educations.push(this.fb.group({
        degree: [edu.degree],
        institution: [edu.institution],
        startYear: [new Date(edu.startDate).getFullYear()],
        endYear: [edu.endDate ? new Date(edu.endDate).getFullYear() : ''],
        gpa: [edu.gpa]
      }));
    });

    // Populate skills
    this.skillsList = cv.skills?.map((s: Skill) => s.name) || [];
    this.updatePreview();
  }

  async generateCV(): Promise<void> {
    this.isGenerating = true;
    try {
      const cvData = this.buildCVData();
      const response = await this.cvService.generatePDF(cvData).toPromise();
      
      // Handle PDF download
      if (response) {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${cvData.fullName}_CV.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Failed to generate PDF');
      }
      
      this.snackBar.open('CV generated successfully!', 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Error generating CV:', error);
      this.snackBar.open('Error generating CV. Please try again.', 'Close', { duration: 3000 });
    } finally {
      this.isGenerating = false;
    }
  }

  async saveCV(): Promise<void> {
    this.isSaving = true;
    try {
      const cvData = this.buildCVData();
      await this.cvService.createCV(cvData).toPromise();
      this.snackBar.open('CV saved successfully!', 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Error saving CV:', error);
      this.snackBar.open('Error saving CV. Please try again.', 'Close', { duration: 3000 });
    } finally {
      this.isSaving = false;
    }
  }

  private buildCVData(): any {
    return {
      ...this.personalInfoForm.value,
      workExperiences: this.workExperienceForm.value.experiences,
      educations: this.educationForm.value.educations,
      skills: this.skillsList.map(skill => ({ name: skill, level: 'Intermediate' }))
    };
  }
}
