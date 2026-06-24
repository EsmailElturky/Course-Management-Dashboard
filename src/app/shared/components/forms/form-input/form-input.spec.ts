import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormInput } from './form-input';

describe('FormInput', () => {
  let fixture: ComponentFixture<FormInput>;
  let component: FormInput;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInput],
    }).compileComponents();

    fixture = TestBed.createComponent(FormInput);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('formControlName', 'courseName');
    fixture.componentRef.setInput('label', 'Course Name');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update value on input', () => {
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'Angular Basics';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value()).toBe('Angular Basics');
  });

  it('should write value via ControlValueAccessor', () => {
    component.writeValue('Test Course');
    expect(component.value()).toBe('Test Course');
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled()).toBe(true);
  });
});
