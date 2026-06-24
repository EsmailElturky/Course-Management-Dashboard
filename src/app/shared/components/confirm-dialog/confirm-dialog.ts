import { Component, inject } from '@angular/core';
import { ConfirmationService } from '../../../core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
  protected readonly confirmationService = inject(ConfirmationService);

  protected onAccept(): void {
    this.confirmationService.accept();
  }

  protected onReject(): void {
    this.confirmationService.reject();
  }
}
