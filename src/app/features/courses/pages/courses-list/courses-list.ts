import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ConfirmationService, ToastService } from '../../../../core';
import { LoadingSkeleton, Pagination } from '../../../../shared';
import { CourseCard } from '../../components/course-card/course-card';
import { CourseStatus } from '../../enums';
import { Course } from '../../interfaces';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-courses-list',
  imports: [FormsModule, RouterLink, CourseCard, Pagination, LoadingSkeleton],
  templateUrl: './courses-list.html',
  styleUrl: './courses-list.scss',
})
export class CoursesList implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly pageSize = 6;
  protected readonly statusOptions = Object.values(CourseStatus);

  protected readonly courses = signal<Course[]>([]);
  protected readonly total = signal(0);
  protected readonly page = signal(1);
  protected readonly search = signal('');
  protected readonly statusFilter = signal<CourseStatus | ''>('');
  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCourses();
  }

  protected onSearchChange(value: string): void {
    this.search.set(value);
    this.page.set(1);
    this.loadCourses();
  }

  protected onStatusChange(value: string): void {
    this.statusFilter.set(value as CourseStatus | '');
    this.page.set(1);
    this.loadCourses();
  }

  protected onPageChange(page: number): void {
    this.page.set(page);
    this.loadCourses();
  }

  protected onView(id: number): void {
    this.router.navigate(['/courses-details', id]);
  }

  protected onEdit(id: number): void {
    this.router.navigate(['/add-edit-course', id]);
  }

  protected onDelete(id: number): void {
    const course = this.courses().find((item) => item.id === id);
    if (!course) {
      return;
    }

    this.confirmationService.confirm({
      header: 'Delete Course',
      message: `Are you sure you want to delete "${course.courseName}"?`,
      acceptLabel: 'Delete',
      accept: () => this.deleteCourse(id),
    });
  }

  loadCourses(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.courseService
      .getCourses({
        page: this.page(),
        pageSize: this.pageSize,
        search: this.search(),
        status: this.statusFilter(),
      })
      .subscribe({
        next: (response) => {
          this.courses.set(response.data);
          this.total.set(response.total);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Failed to load courses. Please try again.');
          this.courses.set([]);
          this.total.set(0);
          this.isLoading.set(false);
        },
      });
  }

  private deleteCourse(id: number): void {
    this.courseService.deleteCourse(id).subscribe({
      next: () => {
        this.toastService.success('Course deleted', 'The course was removed successfully.');
        this.loadCourses();
      },
      error: () => {
        this.toastService.error('Delete failed', 'Unable to delete the course.');
      },
    });
  }
}
