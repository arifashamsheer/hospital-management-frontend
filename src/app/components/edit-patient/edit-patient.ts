import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apiservice } from '../../services/apiservice';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-patient',
  standalone: false,
  templateUrl: './edit-patient.html',
  styleUrl: './edit-patient.css',
})
export class EditPatient implements OnInit {

  editPatientForm!: FormGroup;

  patientId = '';

  isLoading = false;
  isSaving = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private api: Apiservice,
    private route: ActivatedRoute,
    private router: Router,private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    this.patientId =
      this.route.snapshot.paramMap.get('id') || '';

    if (!this.patientId) {
      this.errorMessage =
        'Patient ID is missing.';
      return;
    }

    this.loadPatient();
  }

  initializeForm(): void {
    this.editPatientForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
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
          Validators.pattern(/^[0-9+\-\s]{7,15}$/)
        ]
      ],

      medicalHistory: ['']
    });
  }

  loadPatient(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.api
      .getPatientById(this.patientId)
      .subscribe({
        next: (response: any) => {
          const patient =
            response.patient ??
            response.data ??
            response;

          this.editPatientForm.patchValue({
            name: patient.name ?? '',
            age: patient.age ?? '',
            gender: patient.gender ?? '',
            email: patient.email ?? '',
            phone: patient.phone ?? '',
            medicalHistory:
              patient.medicalHistory ?? ''
          });

          this.isLoading = false;
            this.cd.detectChanges();
        },

        error: (error) => {
          console.error(
            'Patient loading error:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            'Unable to load patient details.';

          this.isLoading = false;
            this.cd.detectChanges();
        }
      });
  }

  updatePatient(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.editPatientForm.invalid) {
      this.editPatientForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    this.api
      .updatePatient(
        this.patientId,
        this.editPatientForm.value
      )
      .subscribe({
        next: () => {
          this.successMessage =
            'Patient updated successfully.';

          this.isSaving = false;

          setTimeout(() => {
            this.router.navigate([
              '/admin-patient-details',
              this.patientId
            ]);
          }, 1000);
        },

        error: (error) => {
          console.error(
            'Patient update error:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            'Unable to update patient.';

          this.isSaving = false;
        }
      });
  }

  cancel(): void {
    this.router.navigate([
      '/admin-patient-details',
      this.patientId
    ]);
  }

  get name() {
    return this.editPatientForm.get('name');
  }

  get age() {
    return this.editPatientForm.get('age');
  }

  get gender() {
    return this.editPatientForm.get('gender');
  }

  get email() {
    return this.editPatientForm.get('email');
  }

  get phone() {
    return this.editPatientForm.get('phone');
  }

}
