import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'courses-list', pathMatch: 'full' },
  { path: 'courses-list', loadComponent: () => import('./features/courses/pages/courses-list/courses-list').then((m) => m.CoursesList) },
  { path: 'courses-details/:id', loadComponent: () => import('./features/courses/pages/courses-details/courses-details').then((m) => m.CoursesDetails) },
  { path: 'add-edit-course/:id', loadComponent: () => import('./features/courses/pages/add-edit-course/add-edit-course').then((m) => m.AddEditCourse) },
  { path: '**', redirectTo: 'courses-list', pathMatch: 'full' },
];
