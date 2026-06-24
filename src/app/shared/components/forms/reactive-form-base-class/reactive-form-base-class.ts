import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Component, inject, input, model } from '@angular/core';

@Component({
  template: '',
})
export abstract class ReactiveFormBaseClassComponent<T> implements ControlValueAccessor {
  private readonly controlContainer = inject(ControlContainer, { optional: true });

  value = model<T | null>(null);
  disabled = model<boolean>(false);
  formControlName = input<string | null>(null);

  get form(): FormGroup | null {
    if (!this.formControlName()) {
      return null;
    }

    return this.controlContainer?.control as FormGroup | null;
  }

  get control(): FormControl | null {
    if (!this.formControlName()) {
      return null;
    }

    return this.form?.get(this.formControlName()!) as FormControl | null;
  }

  protected onChange: (_: T) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(value: T): void {
    this.value.set(value);
  }

  registerOnChange(fn: (_: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected hasError(): boolean {
    const ctrl = this.control;
    return !!ctrl?.errors && (ctrl.touched || ctrl.dirty);
  }
}
