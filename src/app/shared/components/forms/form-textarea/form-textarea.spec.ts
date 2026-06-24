import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormTextarea } from './form-textarea';

describe('FormTextarea', () => {
  let fixture: ComponentFixture<FormTextarea>;
  let component: FormTextarea;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTextarea],
    }).compileComponents();

    fixture = TestBed.createComponent(FormTextarea);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Description');
    fixture.componentRef.setInput('maxLength', 500);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update value on input', () => {
    fixture.detectChanges();
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    textarea.value = 'Course description';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value()).toBe('Course description');
  });

  it('should write value via ControlValueAccessor', () => {
    component.writeValue('Saved description');
    expect(component.value()).toBe('Saved description');
  });
});
