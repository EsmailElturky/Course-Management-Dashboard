import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CourseCategory } from '../../enums/course-category.enum';
import { CourseStatus } from '../../enums/course-status.enum';
import { Course } from '../../interfaces';
import { CourseService } from '../../services/course.service';
import { CoursesList } from './courses-list';

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
];

describe('CoursesList', () => {
  let fixture: ComponentFixture<CoursesList>;
  let component: CoursesList;
  let courseService: { getCourses: ReturnType<typeof vi.fn>; deleteCourse: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    courseService = {
      getCourses: vi.fn(() =>
        of({
          data: mockCourses,
          total: 1,
          page: 1,
          pageSize: 6,
        }),
      ),
      deleteCourse: vi.fn(() => of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [CoursesList],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CourseService, useValue: courseService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesList);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load courses on init', () => {
    fixture.detectChanges();
    expect(courseService.getCourses).toHaveBeenCalled();
    expect(component['courses']()).toEqual(mockCourses);
  });

  it('should render course cards after loading', () => {
    component['isLoading'].set(false);
    component['courses'].set(mockCourses);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('app-course-card');
    expect(cards.length).toBe(1);
  });

  it('should show empty state when no courses are returned', () => {
    component['isLoading'].set(false);
    component['courses'].set([]);
    component['error'].set(null);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No courses found');
  });

  it('should navigate to details on view', () => {
    component['onView'](1);
    expect(router.navigate).toHaveBeenCalledWith(['/courses-details', 1]);
  });

  it('should set error state when loading fails', () => {
    courseService.getCourses.mockReturnValue(throwError(() => new Error('Failed')));
    component['loadCourses']();
    expect(component['error']()).toBe('Failed to load courses. Please try again.');
  });
});
