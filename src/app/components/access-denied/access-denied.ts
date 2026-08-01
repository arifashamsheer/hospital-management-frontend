import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-access-denied',
  standalone: false,
  templateUrl: './access-denied.html',
  styleUrl: './access-denied.css',
})
export class AccessDenied {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  goToDashboard() {

    const user = this.authService.getUser();

    if (user?.role === 'admin') {

      this.router.navigate(['/admin-dashboard']);

    }
    else if (user?.role === 'doctor') {

      this.router.navigate(['/doctor-dashboard']);

    }
    else if (user?.role === 'patient') {

      this.router.navigate(['/patient-dashboard']);

    }
    else {

      this.router.navigate(['/login']);

    }

  }

  logout() {

    this.authService.logout();

    this.router.navigate(['/login']);

  }

}
