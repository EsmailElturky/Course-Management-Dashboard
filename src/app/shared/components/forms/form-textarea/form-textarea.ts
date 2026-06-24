import { Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlErrorHandler } from '../control-error-handler/control-error-handler';
import { ReactiveFormBaseClassComponent } from '../reactive-form-base-class/reactive-form-base-class';

@Component({
  selector: 'app-form-textarea',
  imports: [ControlErrorHandler],
  templateUrl: './form-textarea.html',
  styleUrl: './form-textarea.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTextarea),
      multi: true,
    },
  ],
})
export class FormTextarea extends ReactiveFormBaseClassComponent<string> {
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly rows = input<number>(4);
  readonly maxLength = input<number | null>(null);

  protected onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const next = target.value;
    this.value.set(next);
    this.onChange(next);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
