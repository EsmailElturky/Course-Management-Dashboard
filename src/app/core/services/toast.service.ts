import { Injectable, signal } from '@angular/core';
import { ToastSeverity } from '../enums';
import { ToastMessage } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;

  readonly toasts = signal<ToastMessage[]>([]);

  show(severity: ToastSeverity, summary: string, detail?: string): void {
    const id = ++this.nextId;
    const toast: ToastMessage = { id, severity, summary, detail };

    this.toasts.update((items) => [...items, toast]);

    setTimeout(() => this.remove(id), 1000);
  }

  success(summary: string, detail?: string): void {
    this.show(ToastSeverity.Success, summary, detail);
  }

  error(summary: string, detail?: string): void {
    this.show(ToastSeverity.Error, summary, detail);
  }

  remove(id: number): void {
    this.toasts.update((items) => items.filter((t) => t.id !== id));
  }
}
