import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { CourseStatus } from '../../enums';
import { Course } from '../../interfaces';

@Component({
  selector: 'app-course-card',
  imports: [CurrencyPipe],
  templateUrl: './course-card.html',
  styleUrl: './course-card.scss',
})
export class CourseCard {
  readonly course = input.required<Course>();

  readonly view = output<number>();
  readonly edit = output<number>();
  readonly delete = output<number>();

  protected readonly statusClass = computed(() => {
    const map: Record<CourseStatus, string> = {
      [CourseStatus.Active]: 'text-bg-success',
      [CourseStatus.Draft]: 'text-bg-warning',
      [CourseStatus.Archived]: 'text-bg-secondary',
    };

    return map[this.course().status];
  });

  protected onView(): void {
    this.view.emit(this.course().id);
  }

  protected onEdit(): void {
    this.edit.emit(this.course().id);
  }

  protected onDelete(): void {
    this.delete.emit(this.course().id);
  }
}
