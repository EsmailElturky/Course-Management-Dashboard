import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoadingSkeleton } from '../../../../shared';
import { CourseStatus } from '../../enums';
import { Course } from '../../interfaces';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-courses-details',
  imports: [RouterLink, CurrencyPipe, DatePipe, LoadingSkeleton],
  templateUrl: './courses-details.html',
  styleUrl: './courses-details.scss',
})
export class CoursesDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);

  protected readonly course = signal<Course | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly statusClass = computed(() => {
    const current = this.course();
    if (!current) {
      return 'text-bg-secondary';
    }

    const map: Record<CourseStatus, string> = {
      [CourseStatus.Active]: 'text-bg-success',
      [CourseStatus.Draft]: 'text-bg-warning',
      [CourseStatus.Archived]: 'text-bg-secondary',
    };

    return map[current.status];
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error.set('Invalid course id.');
      return;
    }

    this.loadCourse(id);
  }

  protected loadCourse(id: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.course.set(course);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Course not found or failed to load.');
        this.course.set(null);
        this.isLoading.set(false);
      },
    });
  }
}
