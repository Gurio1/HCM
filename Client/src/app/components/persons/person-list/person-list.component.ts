import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../../services/person.service';
import { AuthService } from '../../../services/auth.service';
import { PagedResponse, Person } from '../../../models/person.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss'],
  standalone: true,
})
export class PersonListComponent implements OnInit {
  persons: PagedResponse | null = null;
  isLoading = true;
  displayedColumns: string[] = [
    'name',
    'email',
    'jobTitle',
    'department',
    'role',
    'salary',
    'actions',
  ];

  constructor(
    private personService: PersonService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons(page: number = 1, pageSize: number = 10): void {
    this.isLoading = true;
    this.personService.getPersons(page, pageSize).subscribe({
      next: (data) => {
        this.persons = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load persons', 'Close', {
          duration: 5000,
        });
        this.isLoading = false;
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.loadPersons(event.pageIndex + 1, event.pageSize);
  }

  canEdit(person: Person): boolean {
    return this.authService.canEditPerson(person);
  }

  canDelete(): boolean {
    return this.authService.hasRole('HrAdmin');
  }

  canCreate(): boolean {
    return this.authService.hasRole('HrAdmin');
  }

  deletePerson(person: Person): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Person',
        message: `Are you sure you want to delete ${person.firstName} ${person.lastName}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Note: We need the person ID, but it's not in the Person model
        // This would need to be added to the backend response
        this.snackBar.open(
          'Delete functionality requires person ID from backend',
          'Close',
          { duration: 5000 }
        );
      }
    });
  }

  getRoleDisplayName(role: string): string {
    switch (role) {
      case 'HrAdmin':
        return 'HR Admin';
      case 'Manager':
        return 'Manager';
      case 'Employee':
        return 'Employee';
      default:
        return role;
    }
  }
}
