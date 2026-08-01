import { ChangeDetectorRef, Component } from '@angular/core';

import { Login } from '../../models/login'
import { AuthService } from '../../services/auth-service';
import { Apiservice } from '../../services/apiservice';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponents {

  loginForm: FormGroup;

  isLoading = false;
  hidePassword = true;

  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private apiService: Apiservice,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]
    });
  }

  loginhere(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const loginData = {
      email:
        this.loginForm.value.email
          .trim()
          .toLowerCase(),

      password:
        this.loginForm.value.password
    };

    this.apiService
      .loginApi(loginData)
      .subscribe({
        next: (result) => {

          this.isLoading = false;

          this.authService.saveToken(
            result.token
          );

          localStorage.setItem(
            'user',
            JSON.stringify(result.user)
          );

          const role = result.user.role;

          if (role === 'patient') {
            this.router.navigate([
              '/patient-dashboard'
            ]);
          }

          else if (role === 'doctor') {
            this.router.navigate([
              '/doctor-dashboard'
            ]);
          }

          else if (role === 'admin') {
            this.router.navigate([
              '/admin-dashboard'
            ]);
          }

          else {
            this.errorMessage =
              'Invalid user role.';
          }
        },

        error: (err) => {

          console.error(err);

          this.isLoading = false;

          this.errorMessage =
            err.error?.message ||
            'Invalid email or password.';
        }
      });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  hasError(
    controlName: string,
    errorName: string
  ): boolean {

    const control =
      this.loginForm.get(controlName);

    return Boolean(
      control?.touched &&
      control.hasError(errorName)
    );
  }


}
