import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PersonService } from '../../services/person.service';
import { User } from '../../models/auth.model';
import { PagedResponse } from '../../models/person.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  recentPersons: PagedResponse | null = null;
  isLoading = true;

  constructor(
    private authService: AuthService,
    private personService: PersonService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadRecentPersons();
  }

  loadRecentPersons(): void {
    if (this.canViewPersons()) {
      this.personService.getPersons(1, 5).subscribe({
        next: (data) => {
          this.recentPersons = data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
    } else {
      this.isLoading = false;
    }
  }

  canViewPersons(): boolean {
    return (
      this.currentUser?.role === 'HrAdmin' ||
      this.currentUser?.role === 'Manager'
    );
  }

  canCreatePersons(): boolean {
    return this.currentUser?.role === 'HrAdmin';
  }

  getRoleDisplayName(role: string): string {
    switch (role) {
      case 'HrAdmin':
        return 'HR Administrator';
      case 'Manager':
        return 'Manager';
      case 'Employee':
        return 'Employee';
      default:
        return role;
    }
  }
}
