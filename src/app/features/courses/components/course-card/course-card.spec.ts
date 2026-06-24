import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseCategory } from '../../enums/course-category.enum';
import { CourseStatus } from '../../enums/course-status.enum';
import { Course } from '../../interfaces';
import { CourseCard } from './course-card';

const mockCourse: Course = {
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

describe('CourseCard', () => {
  let fixture: ComponentFixture<CourseCard>;
  let component: CourseCard;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('course', mockCourse);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render course details', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Angular Fundamentals');
    expect(element.textContent).toContain('Ahmed Ali');
    expect(element.textContent).toContain('Frontend');
    expect(element.textContent).toContain('Active');
  });

  it('should emit view with course id', () => {
    fixture.detectChanges();
    const viewSpy = vi.spyOn(component.view, 'emit');

    component['onView']();

    expect(viewSpy).toHaveBeenCalledWith(1);
  });

  it('should emit edit with course id', () => {
    fixture.detectChanges();
    const editSpy = vi.spyOn(component.edit, 'emit');

    component['onEdit']();

    expect(editSpy).toHaveBeenCalledWith(1);
  });

  it('should emit delete with course id', () => {
    fixture.detectChanges();
    const deleteSpy = vi.spyOn(component.delete, 'emit');

    component['onDelete']();

    expect(deleteSpy).toHaveBeenCalledWith(1);
  });
});
