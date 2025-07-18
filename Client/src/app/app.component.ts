import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone : true,
})
export class AppComponent implements OnInit {
  title = 'HCM System';
  isAuthenticated = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.isAuthenticated = !!user;

      if (!user && !this.isPublicRoute()) {
        this.router.navigate(['/login']);
      }
    });
  }

  private isPublicRoute(): boolean {
    const publicRoutes = ['/login', '/signup'];
    return publicRoutes.includes(this.router.url);
  }
}
