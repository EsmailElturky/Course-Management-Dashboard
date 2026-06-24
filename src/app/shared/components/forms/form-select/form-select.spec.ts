import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormSelect } from './form-select';

describe('FormSelect', () => {
  let fixture: ComponentFixture<FormSelect>;
  let component: FormSelect;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSelect],
    }).compileComponents();

    fixture = TestBed.createComponent(FormSelect);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Category');
    fixture.componentRef.setInput('options', [
      { label: 'Frontend', value: 'Frontend' },
      { label: 'Backend', value: 'Backend' },
    ]);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render options', () => {
    fixture.detectChanges();
    const options = fixture.nativeElement.querySelectorAll('option');
    expect(options.length).toBeGreaterThan(1);
  });

  it('should update value on select change', () => {
    fixture.detectChanges();
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.value = 'Backend';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.value()).toBe('Backend');
  });

  it('should write value via ControlValueAccessor', () => {
    component.writeValue('Frontend');
    expect(component.value()).toBe('Frontend');
  });
});
