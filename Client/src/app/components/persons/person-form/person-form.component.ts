import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PersonService } from '../../../services/person.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.scss'],
  standalone: true,
})
export class PersonFormComponent implements OnInit {
  personForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  personId: string | null = null;
  hidePassword = true;

  departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales'];
  roles = ['Employee', 'Manager', 'HrAdmin'];

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.personForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      jobTitle: ['', [Validators.required, Validators.maxLength(100)]],
      salary: [
        '',
        [Validators.required, Validators.min(0), Validators.max(1000000)],
      ],
      department: ['', [Validators.required]],
      role: ['Employee', [Validators.required]],
      password: [
        '',
        [Validators.required, Validators.minLength(8), this.passwordValidator],
      ],
    });
  }

  ngOnInit(): void {
    this.personId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.personId;

    if (this.isEditMode) {
      this.personForm.removeControl('password');
      this.loadPerson();
    }
  }

  passwordValidator(control: any) {
    const value = control.value;
    if (!value) return null;

    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\[\]{}:;<>,.?/~\\-]/.test(value);

    if (!hasNumber || !hasSpecial) {
      return { invalidPassword: true };
    }
    return null;
  }

  loadPerson(): void {
    if (!this.personId) return;

    this.isLoading = true;
    this.personService.getPersonById(this.personId).subscribe({
      next: (person) => {
        this.personForm.patchValue(person);
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load person details', 'Close', {
          duration: 5000,
        });
        this.isLoading = false;
        this.router.navigate(['/persons']);
      },
    });
  }

  onSubmit(): void {
    if (this.personForm.valid) {
      this.isLoading = true;

      if (this.isEditMode && this.personId) {
        const updateRequest = {
          personId: this.personId,
          ...this.personForm.value,
        };

        this.personService.updatePerson(updateRequest).subscribe({
          next: () => {
            this.snackBar.open('Person updated successfully!', 'Close', {
              duration: 3000,
            });
            this.router.navigate(['/persons']);
          },
          error: (error) => {
            this.isLoading = false;
            this.snackBar.open(error.error?.Error || 'Update failed', 'Close', {
              duration: 5000,
            });
          },
        });
      } else {
        this.personService.createPerson(this.personForm.value).subscribe({
          next: () => {
            this.snackBar.open('Person created successfully!', 'Close', {
              duration: 3000,
            });
            this.router.navigate(['/persons']);
          },
          error: (error) => {
            this.isLoading = false;
            this.snackBar.open(
              error.error?.Error || 'Creation failed',
              'Close',
              { duration: 5000 }
            );
          },
        });
      }
    }
  }

  canEditRole(): boolean {
    return this.authService.hasRole('HrAdmin');
  }

  cancel(): void {
    this.router.navigate(['/persons']);
  }
}
