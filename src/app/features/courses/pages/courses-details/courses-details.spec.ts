import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CourseCategory } from '../../enums/course-category.enum';
import { CourseStatus } from '../../enums/course-status.enum';
import { CourseService } from '../../services/course.service';
import { CoursesDetails } from './courses-details';

const mockCourse = {
  id: 1,
  courseName: 'Angular Fundamentals',
  instructorName: 'Ahmed Ali',
  category: CourseCategory.Frontend,
  duration: 20,
  price: 1500,
  status: CourseStatus.Active,
  createdDate: '2026-06-01',
  description: 'Learn Angular basics.',
};

describe('CoursesDetails', () => {
  let fixture: ComponentFixture<CoursesDetails>;
  let component: CoursesDetails;
  let courseService: { getCourseById: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    courseService = {
      getCourseById: vi.fn(() => of(mockCourse)),
    };

    await TestBed.configureTestingModule({
      imports: [CoursesDetails],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
        { provide: CourseService, useValue: courseService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load course on init', () => {
    fixture.detectChanges();
    expect(courseService.getCourseById).toHaveBeenCalledWith(1);
    expect(component['course']()).toEqual(mockCourse);
  });

  it('should render course details', () => {
    component['course'].set(mockCourse);
    component['isLoading'].set(false);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Angular Fundamentals');
    expect(element.textContent).toContain('Ahmed Ali');
    expect(element.textContent).toContain('Learn Angular basics.');
  });

  it('should show error when course fails to load', () => {
    courseService.getCourseById.mockReturnValue(throwError(() => new Error('Not found')));
    component['loadCourse'](1);

    expect(component['error']()).toBe('Course not found or failed to load.');
    expect(component['course']()).toBeNull();
  });

  it('should show error for invalid course id', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [CoursesDetails],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null,
              },
            },
          },
        },
        { provide: CourseService, useValue: courseService },
      ],
    }).compileComponents();

    const invalidFixture = TestBed.createComponent(CoursesDetails);
    invalidFixture.detectChanges();

    expect(invalidFixture.componentInstance['error']()).toBe('Invalid course id.');
  });
});
