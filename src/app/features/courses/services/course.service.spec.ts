import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Loading } from '../../../core';
import { CourseCategory } from '../enums/course-category.enum';
import { CourseStatus } from '../enums/course-status.enum';
import { Course } from '../interfaces';
import { CourseService } from './course.service';

const STORAGE_KEY = 'courses';
const MOCK_DELAY_MS = 1000;

const mockCourses: Course[] = [
  {
    id: 1,
    courseName: 'Angular Fundamentals',
    instructorName: 'Ahmed Ali',
    category: CourseCategory.Frontend,
    duration: 20,
    price: 1500,
    status: CourseStatus.Active,
    createdDate: '2026-06-01',
  },
  {
    id: 2,
    courseName: 'Node.js API Development',
    instructorName: 'Omar Farouk',
    category: CourseCategory.Backend,
    duration: 25,
    price: 1800,
    status: CourseStatus.Draft,
    createdDate: '2026-05-25',
  },
];

describe('CourseService', () => {
  let service: CourseService;
  let httpMock: HttpTestingController;
  let loading: Loading;

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CourseService);
    httpMock = TestBed.inject(HttpTestingController);
    loading = TestBed.inject(Loading);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
    vi.useRealTimers();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load courses from localStorage without http on subsequent requests', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCourses));

    const promise = firstValueFrom(
      service.getCourses({ page: 1, pageSize: 10, search: '', status: '' }),
    );

    vi.advanceTimersByTime(MOCK_DELAY_MS);
    const response = await promise;

    httpMock.expectNone('/assets/courses.json');
    expect(response.total).toBe(2);
  });

  it('should filter courses by search and status', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCourses));

    const promise = firstValueFrom(
      service.getCourses({
        page: 1,
        pageSize: 10,
        search: 'Angular',
        status: CourseStatus.Active,
      }),
    );

    vi.advanceTimersByTime(MOCK_DELAY_MS);
    const response = await promise;

    expect(response.total).toBe(1);
    expect(response.data[0].courseName).toBe('Angular Fundamentals');
  });

  it('should persist create, update, and delete in localStorage', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCourses));

    const createPromise = firstValueFrom(
      service.createCourse({
        courseName: 'New Course',
        instructorName: 'Test Instructor',
        category: CourseCategory.Data,
        duration: 10,
        price: 500,
        status: CourseStatus.Draft,
      }),
    );
    vi.advanceTimersByTime(MOCK_DELAY_MS);
    const created = await createPromise;

    expect(created.courseName).toBe('New Course');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).length).toBe(3);

    const updatePromise = firstValueFrom(
      service.updateCourse(created.id, {
        courseName: created.courseName,
        instructorName: created.instructorName,
        category: created.category,
        duration: created.duration,
        price: 750,
        status: created.status,
      }),
    );
    vi.advanceTimersByTime(MOCK_DELAY_MS);
    const updated = await updatePromise;

    expect(updated.price).toBe(750);

    const deletePromise = firstValueFrom(service.deleteCourse(created.id));
    vi.advanceTimersByTime(MOCK_DELAY_MS);
    await deletePromise;

    const stored: Course[] = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.length).toBe(2);
    expect(stored.find((course) => course.id === created.id)).toBeUndefined();
  });
});
