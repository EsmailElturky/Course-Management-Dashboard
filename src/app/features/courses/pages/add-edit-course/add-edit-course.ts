import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../../core';
import { FormInput, FormSelect, FormTextarea, SelectOption } from '../../../../shared';
import { CourseCategory, CourseStatus } from '../../enums';
import { CreateCourseRequest } from '../../interfaces';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-add-edit-course',
  imports: [ReactiveFormsModule, RouterLink, FormInput, FormSelect, FormTextarea],
  templateUrl: './add-edit-course.html',
  styleUrl: './add-edit-course.scss',
})
export class AddEditCourse implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);
  private readonly toastService = inject(ToastService);

  protected readonly isEditMode = signal(false);
  protected readonly isLoading = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly categoryOptions: SelectOption[] = Object.values(CourseCategory).map(
    (category) => ({ label: category, value: category }),
  );

  protected readonly statusOptions: SelectOption[] = Object.values(CourseStatus).map(
    (status) => ({ label: status, value: status }),
  );

  protected readonly form = this.fb.nonNullable.group({
    courseName: ['', [Validators.required, Validators.minLength(3)]],
    instructorName: ['', Validators.required],
    category: ['', Validators.required],
    duration: ['', [Validators.required, Validators.min(1)]],
    price: ['', [Validators.required, Validators.min(0)]],
    status: ['', Validators.required],
    description: ['', Validators.maxLength(500)],
  });

  private courseId: number | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode.set(true);
      this.courseId = Number(idParam);
      this.loadCourse(this.courseId);
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();
    this.isSubmitting.set(true);
    this.error.set(null);

    const request$ =
      this.isEditMode() && this.courseId
        ? this.courseService.updateCourse(this.courseId, payload)
        : this.courseService.createCourse(payload);

    request$.subscribe({
      next: () => {
        this.toastService.success(
          this.isEditMode() ? 'Course updated' : 'Course created',
          this.isEditMode()
            ? 'The course was updated successfully.'
            : 'The course was added successfully.',
        );
        this.router.navigate(['/courses-list']);
      },
      error: () => {
        this.error.set(
          this.isEditMode()
            ? 'Failed to update the course. Please try again.'
            : 'Failed to create the course. Please try again.',
        );
        this.isSubmitting.set(false);
      },
    });
  }

  protected loadCourse(id: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.form.patchValue({
          courseName: course.courseName,
          instructorName: course.instructorName,
          category: course.category,
          duration: String(course.duration),
          price: String(course.price),
          status: course.status,
          description: course.description ?? '',
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Course not found or failed to load.');
        this.isLoading.set(false);
      },
    });
  }

  private buildPayload(): CreateCourseRequest {
    const { courseName, instructorName, category, duration, price, status, description } =
      this.form.getRawValue();

    return {
      courseName,
      instructorName,
      category: category as CourseCategory,
      duration: Number(duration),
      price: Number(price),
      status: status as CourseStatus,
      description: description || undefined,
    };
  }
}
