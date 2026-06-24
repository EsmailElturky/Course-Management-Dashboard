import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CourseCategory } from '../../enums/course-category.enum';
import { CourseStatus } from '../../enums/course-status.enum';
import { CourseService } from '../../services/course.service';
import { AddEditCourse } from './add-edit-course';

describe('AddEditCourse', () => {
  let fixture: ComponentFixture<AddEditCourse>;
  let component: AddEditCourse;
  let courseService: {
    getCourseById: ReturnType<typeof vi.fn>;
    createCourse: ReturnType<typeof vi.fn>;
    updateCourse: ReturnType<typeof vi.fn>;
  };
  let router: Router;

  beforeEach(async () => {
    courseService = {
      getCourseById: vi.fn(),
      createCourse: vi.fn(() => of({ id: 1 })),
      updateCourse: vi.fn(() => of({ id: 1 })),
    };

    await TestBed.configureTestingModule({
      imports: [AddEditCourse],
      providers: [
        provideRouter([]),
        { provide: CourseService, useValue: courseService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditCourse);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start in create mode by default', () => {
    expect(component['isEditMode']()).toBe(false);
  });

  it('should not submit when form is invalid', () => {
    component['submit']();
    expect(courseService.createCourse).not.toHaveBeenCalled();
    expect(component['form'].touched).toBe(true);
  });

  it('should create course when form is valid', () => {
    component['form'].setValue({
      courseName: 'Angular Basics',
      instructorName: 'Ahmed Ali',
      category: CourseCategory.Frontend,
      duration: '10',
      price: '500',
      status: CourseStatus.Active,
      description: 'Intro course',
    });

    component['submit']();

    expect(courseService.createCourse).toHaveBeenCalled();
  });

  it('should load course in edit mode', () => {
    courseService.getCourseById.mockReturnValue(
      of({
        id: 1,
        courseName: 'Angular Fundamentals',
        instructorName: 'Ahmed Ali',
        category: CourseCategory.Frontend,
        duration: 20,
        price: 1500,
        status: CourseStatus.Active,
        createdDate: '2026-06-01',
        description: 'Learn Angular',
      }),
    );

    component['isEditMode'].set(true);
    component['loadCourse'](1);

    expect(courseService.getCourseById).toHaveBeenCalledWith(1);
    expect(component['form'].value.courseName).toBe('Angular Fundamentals');
  });

  it('should set error when course load fails', () => {
    courseService.getCourseById.mockReturnValue(throwError(() => new Error('Not found')));

    component['loadCourse'](999);

    expect(component['error']()).toBe('Course not found or failed to load.');
  });
});
