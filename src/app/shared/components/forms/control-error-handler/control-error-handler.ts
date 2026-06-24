import { Component, input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { ControlError } from '../../../enums';

@Component({
  selector: 'app-control-error-handler',
  templateUrl: './control-error-handler.html',
  styleUrl: './control-error-handler.scss',
})
export class ControlErrorHandler {
  readonly error = input<ValidationErrors | null | undefined>(null);
  readonly label = input<string>('');

  protected readonly ControlError = ControlError;
}
