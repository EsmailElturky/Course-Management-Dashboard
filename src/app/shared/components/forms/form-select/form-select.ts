import { Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOption } from '../../../interfaces';
import { ControlErrorHandler } from '../control-error-handler/control-error-handler';
import { ReactiveFormBaseClassComponent } from '../reactive-form-base-class/reactive-form-base-class';

@Component({
  selector: 'app-form-select',
  imports: [ControlErrorHandler],
  templateUrl: './form-select.html',
  styleUrl: './form-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelect),
      multi: true,
    },
  ],
})
export class FormSelect extends ReactiveFormBaseClassComponent<string | number> {
  readonly label = input<string>('');
  readonly placeholder = input<string>('Select an option');
  readonly options = input<SelectOption[]>([]);

  protected onSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selected = target.value;
    const matched = this.options().find((option) => String(option.value) === selected);
    const nextValue = matched?.value ?? selected;
    this.value.set(nextValue);
    this.onChange(nextValue);
  }

  protected onBlur(): void {
    this.onTouched();
  }

  protected isSelected(option: SelectOption): boolean {
    return String(this.value() ?? '') === String(option.value);
  }
}
