import { Component, inject } from '@angular/core';
import { ToastMessage, ToastService, ToastSeverity } from '../../../core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast {
  protected readonly toastService = inject(ToastService);

  protected severityClass(severity: ToastSeverity): string {
    const map: Record<ToastSeverity, string> = {
      [ToastSeverity.Success]: 'text-bg-success',
      [ToastSeverity.Error]: 'text-bg-danger',
    };
    return map[severity];
  }

  protected dismiss(toast: ToastMessage): void {
    this.toastService.remove(toast.id);
  }
}
