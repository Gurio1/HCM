import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, SignupRequest, AuthResponse, User } from '../models/auth.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5221/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromToken();
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request, { withCredentials: true })
      .pipe(
        tap(response => {
          this.setToken(response.accessToken);
          this.loadUserFromToken();
        })
      );
  }

  signup(request: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, request, { withCredentials: true })
      .pipe(
        tap(response => {
          this.setToken(response.accessToken);
          this.loadUserFromToken();
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.clearToken();
          this.currentUserSubject.next(null);
          this.router.navigate(['/login']);
        })
      );
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true })
      .pipe(
        tap(response => {
          this.setToken(response.accessToken);
          this.loadUserFromToken();
        })
      );
  }

  private setToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  private clearToken(): void {
    localStorage.removeItem('accessToken');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  private loadUserFromToken(): void {
    const token = this.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user: User = {
        personId: payload.PersonId,
        email: payload.sub,
        role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        department: payload.Department
      };
      this.currentUserSubject.next(user);
    } catch (error) {
      console.error('Error parsing token:', error);
      this.clearToken();
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  canViewPerson(person: any): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    return user.role === 'HrAdmin' ||
           (user.role === 'Manager' && person.department === user.department) ||
           (user.role === 'Employee' && person.id === user.personId);
  }

  canEditPerson(person: any): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    return user.role === 'HrAdmin' ||
           (user.role === 'Manager' && person.department === user.department);
  }
}