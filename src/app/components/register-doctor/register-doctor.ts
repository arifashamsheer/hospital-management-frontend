import { Component } from '@angular/core';
import { Apiservice } from '../../services/apiservice';
import { RegisterData } from '../../models/registerinterface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register-doctor',
  standalone: false,
  templateUrl: './register-doctor.html',
  styleUrl: './register-doctor.css',
})
export class RegisterDoctor {
  doctorForm: FormGroup;

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private api: Apiservice,
    private router: Router
  ) {
    this.doctorForm = this.fb.group({
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

      specialization: [
        '',
        Validators.required
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9+\-\s]{7,15}$/)
        ]
      ],

      availability: [
        '',
        Validators.required
      ]
    });
  }

  registerDoctor(): void {

    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      return;
    }

    const formValue = this.doctorForm.value;

    const availabilitySlots = formValue.availability
      .split(',')
      .map((time: string) => time.trim())
      .filter((time: string) => time.length > 0);

    if (availabilitySlots.length === 0) {
      this.errorMessage =
        'Please enter at least one availability time.';
      return;
    }

    const data: RegisterData = {
      name: formValue.name.trim(),
      email: formValue.email.trim().toLowerCase(),
      password: formValue.password,
      role: 'doctor',
      specialization: formValue.specialization.trim(),
      phone: formValue.phone.trim(),
      availability: availabilitySlots
    };

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.api.registerApi(data).subscribe({
      next: (res) => {
        console.log(res);

        this.isSubmitting = false;
        this.successMessage =
          'Doctor registered successfully.';

        this.doctorForm.reset();

        setTimeout(() => {
          this.router.navigate([
            '/admin-doctors'
          ]);
        }, 1200);
      },

      error: (err) => {
        console.error(err);

        this.isSubmitting = false;

        this.errorMessage =
          err.error?.message ||
          'Doctor registration failed.';
      }
    });
  }

  cancel(): void {
    this.router.navigate([
      '/admin-dashboard'
    ]);
  }

  hasError(
    controlName: string,
    errorName: string
  ): boolean {
    const control =
      this.doctorForm.get(controlName);

    return Boolean(
      control?.touched &&
      control.hasError(errorName)
    );
  }


}