import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home  {

  constructor(
    private router: Router
  ) {}

  goToLogin(): void {
    this.router.navigate([
      '/login'
    ]);
  }

  goToRegister(): void {
    this.router.navigate([
      '/register'
    ]);
  }

  scrollToServices(): void {
    document
      .getElementById('services')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
  }

  scrollToAbout(): void {
    document
      .getElementById('about')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
  }

  scrollToContact(): void {
    document
      .getElementById('contact')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
  }
}
