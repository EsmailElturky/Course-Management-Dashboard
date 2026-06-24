import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormBaseClassComponent } from './reactive-form-base-class';

@Component({
  selector: 'app-test-reactive-form-control',
  template: '',
  styleUrl: './reactive-form-base-class.scss',
})
class TestReactiveFormControl extends ReactiveFormBaseClassComponent<string> {}

describe('ReactiveFormBaseClassComponent', () => {
  let fixture: ComponentFixture<TestReactiveFormControl>;
  let component: TestReactiveFormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestReactiveFormControl],
    }).compileComponents();

    fixture = TestBed.createComponent(TestReactiveFormControl);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should write and read value', () => {
    component.writeValue('initial');
    expect(component.value()).toBe('initial');
  });

  it('should register onChange callback', () => {
    const onChange = vi.fn();
    component.registerOnChange(onChange);
    component['onChange']('updated');
    expect(onChange).toHaveBeenCalledWith('updated');
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled()).toBe(true);
  });

  it('should return null control when formControlName is not set', () => {
    expect(component.control).toBeNull();
    expect(component.form).toBeNull();
  });
});
