import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/covid-dashboard/covid-dashboard.component').then(c => c.CovidDashboardComponent),
  },
  {
    path: 'covid-reports',
    loadComponent: () => import('./pages/covid-list/covid-list.component').then(c => c.CovidListComponent),
  },
  {
    path: 'covid-report-form',
    loadComponent: () => import('./dialogs/covid-form-dialog/covid-form-dialog.component').then(c => c.CovidFormDialogComponent),
  },
  { path: '',   redirectTo: 'dashboard', pathMatch: 'full' }, // redirect to `first-component`
  { path: '**',  loadComponent: () => import('./pages/page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent), },  // Wildcard route for a 404 page
];
