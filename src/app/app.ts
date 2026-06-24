import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loading } from './core';
import { ConfirmDialog, Toast } from './shared';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, ConfirmDialog],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly loading = inject(Loading);
}
