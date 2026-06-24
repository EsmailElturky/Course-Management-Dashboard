import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import {
  catchError,
  defer,
  finalize,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
  timer,
} from 'rxjs';
import { Loading } from '../../../core';
import {
  Course,
  CourseListResponse,
  CourseQuery,
  CreateCourseRequest,
} from '../interfaces';


@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly http = inject(HttpClient);
  private readonly loading = inject(Loading);

  private courses = signal<Course[]>([]);
  private nextId = signal(1);

  getCourses(query: CourseQuery): Observable<CourseListResponse> {
    return this.request(() => this.buildListResponse(query));
  }

  getCourseById(id: number): Observable<Course> {
    return this.request(() => {
      const course = this.courses().find((item) => item.id === id);
      if (!course) {
        throw new Error(`Course with id ${id} not found`);
      }
      return course;
    }).pipe(catchError((error) => throwError(() => error)));
  }

  createCourse(courseRequest: CreateCourseRequest): Observable<Course> {
    return this.request(() => {
      const course: Course = {
        id: this.nextId() + 1,
        ...courseRequest,
        createdDate: new Date().toISOString().slice(0, 10),
      };

      this.courses.update((items) => [...items, course]);
      this.saveToStorage();
      return course;
    });
  }

  updateCourse(id: number, updateCourseRequest  : CreateCourseRequest): Observable<Course> {
    return this.request(() => {
      const index = this.courses().findIndex((item: Course) => item.id === id);
      if (index === -1) {
        throw new Error(`Course with id ${id} not found`);
      }

      const updated = { ...this.courses()[index], ...updateCourseRequest };
      this.courses.update((items) => items.map((item: Course, i: number) => (i === index ? updated : item)));
      this.saveToStorage();
      return updated;
    }).pipe(catchError((error) => throwError(() => error)));
  }

  deleteCourse(id: number): Observable<void> {
    return this.request(() => {
      const exists = this.courses().some((item: Course) => item.id === id);
      if (!exists) {
        throw new Error(`Course with id ${id} not found`);
      }

      this.courses.update((items) => items.filter((item: Course) => item.id !== id) as Course[]);
      this.saveToStorage();
    }).pipe(catchError((error) => throwError(() => error)));
  }

  private request<T>(action: () => T): Observable<T> {
    return defer(() => {
      this.loading.start();
      return timer(1000).pipe(
        switchMap(() => this.loadCourses()),
        map(action),
        finalize(() => this.loading.stop()),
      );
    });
  }

  private loadCourses(): Observable<void> {

    const stored = localStorage.getItem('courses');
    if (stored) {
      this.setCourses(JSON.parse(stored) as Course[]);
      return of(undefined);
    }

    return this.http.get<Course[]>('assets/courses.json').pipe(
      tap((courses) => {
        this.setCourses(courses);
        this.saveToStorage();
      }),
      map(() => undefined),
    );
  }

  private setCourses(courses: Course[]): void {
    this.courses.set(courses);
    this.nextId.set(Math.max(0, ...courses.map((course) => course.id)) + 1);
  }

  private saveToStorage(): void {
    localStorage.setItem('courses', JSON.stringify(this.courses()));
  }

  private buildListResponse(query: CourseQuery): CourseListResponse {
    const filtered = this.filterCourses(query);
    const start = (query.page - 1) * query.pageSize;

    return {
      data: filtered.slice(start, start + query.pageSize),
      total: filtered.length,
      page: query.page,
      pageSize: query.pageSize,
    };
  }

  private filterCourses(query: CourseQuery): Course[] {
    const search = query.search?.trim().toLowerCase() ?? '';
    const status = query.status ?? '';

    return this.courses().filter((course: Course) => {
      const matchesSearch = !search || course.courseName.toLowerCase().includes(search);
      const matchesStatus = !status || course.status === status;
      return matchesSearch && matchesStatus;
    });
  }
}
