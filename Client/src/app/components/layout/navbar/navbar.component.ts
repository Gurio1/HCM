import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/auth.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout().subscribe();
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
