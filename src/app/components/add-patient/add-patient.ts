import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apiservice } from '../../services/apiservice';
import { Router } from '@angular/router';
import { Patient } from '../../models/patient';

@Component({
  selector: 'app-add-patient',
  standalone: false,
  templateUrl: './add-patient.html',
  styleUrl: './add-patient.css',
})
export class AddPatient {

   patientForm!: FormGroup;

  isSaving = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private api: Apiservice,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.createForm();
  }

  createForm(): void {
    this.patientForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
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

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
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

  addPatient(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    const formValue =
      this.patientForm.getRawValue() as {
        name: string;
        age: number | string;
        gender: string;
        email: string;
        phone: string;
        medicalHistory: string;
      };

    const patientData: Partial<Patient> = {
      name: formValue.name.trim(),
      age: Number(formValue.age),
      gender: formValue.gender,
      email: formValue.email.trim(),
      phone: formValue.phone.trim(),
      medicalHistory:
        formValue.medicalHistory?.trim() || ''
    };

    this.isSaving = true;
    this.errorMessage = '';

    this.api.addPatient(patientData).subscribe({
      next: () => {
        this.isSaving = false;

        alert(
          'Patient added successfully'
        );

        this.router.navigate([
          '/admin-patients'
        ]);
      },

      error: (error) => {
        console.error(
          'Add patient error:',
          error
        );

        this.errorMessage =
          error.error?.message ||
          error.error?.error ||
          'Unable to add patient';

        this.isSaving = false;
        this.cd.detectChanges();
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
      this.patientForm.get(controlName);

    return Boolean(
      control?.touched &&
      control.hasError(errorName)
    );
  }

}
