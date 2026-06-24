import { Injectable, signal } from '@angular/core';

export interface ConfirmationRequest {
  header: string;
  message: string;
  acceptLabel?: string;
  rejectLabel?: string;
  accept: () => void;
  reject?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  readonly request = signal<ConfirmationRequest | null>(null);

  confirm(options: ConfirmationRequest): void {
    this.request.set({
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      ...options,
    });
  }

  accept(): void {
    const current = this.request();
    current?.accept();
    this.request.set(null);
  }

  reject(): void {
    const current = this.request();
    current?.reject?.();
    this.request.set(null);
  }

  close(): void {
    this.request.set(null);
  }
}
