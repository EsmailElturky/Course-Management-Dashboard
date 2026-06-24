import { Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlErrorHandler } from '../control-error-handler/control-error-handler';
import { ReactiveFormBaseClassComponent } from '../reactive-form-base-class/reactive-form-base-class';

@Component({
  selector: 'app-form-input',
  imports: [ControlErrorHandler],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInput),
      multi: true,
    },
  ],
})
export class FormInput extends ReactiveFormBaseClassComponent<string> {
  readonly label = input<string>('');
  readonly type = input<string>('text');
  readonly placeholder = input<string>('');

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const next = target.value;
    this.value.set(next);
    this.onChange(next);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
