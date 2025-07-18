import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PersonFormComponent } from './components/persons/person-form/person-form.component';
import { PersonListComponent } from './components/persons/person-list/person-list.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'persons',
    component: PersonListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['HrAdmin', 'Manager'] },
  },
  {
    path: 'persons/create',
    component: PersonFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['HrAdmin'] },
  },
  {
    path: 'persons/:id/edit',
    component: PersonFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['HrAdmin', 'Manager'] },
  },
  { path: '**', redirectTo: '/dashboard' },
];
