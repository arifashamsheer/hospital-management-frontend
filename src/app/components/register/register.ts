import { ChangeDetectorRef, Component } from '@angular/core';

import { User } from '../../models/user';
import { Patient } from '../../models/patient';
import { Apiservice } from '../../services/apiservice';
import { RegisterData } from '../../models/registerinterface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;

  isLoading = false;
  hidePassword = true;

  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private apiService: Apiservice,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

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
      ],

      age: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.max(120)
        ]
      ],

      gender: [
        '',
        Validators.required
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[0-9+\-\s]{7,15}$/
          )
        ]
      ],

      medicalHistory: ['']
    });
  }

  register(): void {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue =
      this.registerForm.getRawValue();

    const data: RegisterData = {
      name: formValue.name.trim(),

      email:
        formValue.email
          .trim()
          .toLowerCase(),

      password: formValue.password,

      role: 'patient',

      age: Number(formValue.age),

      gender: formValue.gender,

      phone: formValue.phone.trim(),

      medicalHistory:
        formValue.medicalHistory
          ?.trim() || ''
    };

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.apiService
      .registerApi(data)
      .subscribe({
        next: (result) => {

          console.log(result);

          this.isLoading = false;

          this.successMessage =
            'Registration successful. You can now log in.';

          this.registerForm.reset();

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1300);
        },

        error: (err) => {

          console.error(err);

          this.isLoading = false;

          this.errorMessage =
            err.error?.message ||
            'Registration failed. Please try again.';
        }
      });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  hasError(
    controlName: string,
    errorName: string
  ): boolean {

    const control =
      this.registerForm.get(controlName);

    return Boolean(
      control?.touched &&
      control.hasError(errorName)
    );
  }
}
