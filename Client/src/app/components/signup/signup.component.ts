import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signupForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.maxLength(50)]],
        lastName: ['', [Validators.required, Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        jobTitle: ['', [Validators.required, Validators.maxLength(100)]],
        salary: [
          '',
          [Validators.required, Validators.min(0), Validators.max(1000000)],
        ],
        department: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.passwordValidator,
          ],
        ],
        confirmedPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
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

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmedPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.authService.signup(this.signupForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
          this.snackBar.open('Account created successfully!', 'Close', {
            duration: 3000,
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(error.error?.Error || 'Signup failed', 'Close', {
            duration: 5000,
          });
        },
      });
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
