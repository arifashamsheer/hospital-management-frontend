import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apiservice } from '../../services/apiservice';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-doctor',
  standalone: false,
  templateUrl: './edit-doctor.html',
  styleUrl: './edit-doctor.css',
})
export class EditDoctor implements OnInit {

  editDoctorForm!: FormGroup;

  doctorId = '';

  isLoading = false;
  isSaving = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private api: Apiservice,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    this.doctorId =
      this.route.snapshot.paramMap.get('id') || '';

    if (!this.doctorId) {
      this.errorMessage =
        'Doctor ID is missing.';

      this.cd.detectChanges();
      return;
    }

    this.loadDoctor();
  }

  initializeForm(): void {
    this.editDoctorForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
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
          Validators.pattern(
            /^[0-9+\-\s]{7,15}$/
          )
        ]
      ],

      availability: this.fb.array([]),

      isActive: [true]
    });
  }

  get availability(): FormArray {
    return this.editDoctorForm.get(
      'availability'
    ) as FormArray;
  }

  createAvailabilityControl(
    value = ''
  ) {
    return this.fb.control(
      value,
      Validators.required
    );
  }

  loadDoctor(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.cd.detectChanges();

    this.api
      .getDoctorById(this.doctorId)
      .subscribe({
        next: (response: any) => {
          const doctor =
            response.doctor ??
            response.data ??
            response;

          this.editDoctorForm.patchValue({
            name: doctor.name ?? '',
            email: doctor.email ?? '',
            specialization:
              doctor.specialization ?? '',
            phone: doctor.phone ?? '',
            isActive:
              doctor.isActive ?? true
          });

          this.availability.clear();

          const availableTimes =
            doctor.availability ?? [];

          if (availableTimes.length > 0) {
            availableTimes.forEach(
              (time: string) => {
                this.availability.push(
                  this.createAvailabilityControl(
                    time
                  )
                );
              }
            );
          } else {
            this.addAvailability();
          }

          this.isLoading = false;

          this.cd.detectChanges();
        },

        error: (error) => {
          console.error(
            'Doctor loading error:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            'Unable to load doctor details.';

          this.isLoading = false;

          this.cd.detectChanges();
        }
      });
  }

  addAvailability(): void {
    this.availability.push(
      this.createAvailabilityControl()
    );

    this.cd.detectChanges();
  }

  removeAvailability(
    index: number
  ): void {
    if (this.availability.length === 1) {
      this.availability.at(0)
        .setValue('');

      return;
    }

    this.availability.removeAt(index);

    this.cd.detectChanges();
  }

  updateDoctor(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.editDoctorForm.invalid) {
      this.editDoctorForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    this.cd.detectChanges();

    const formValue =
      this.editDoctorForm.value;

    const doctorData = {
      name: formValue.name,
      email: formValue.email,
      specialization:
        formValue.specialization,
      phone: formValue.phone,
      availability:
        formValue.availability
          .map(
            (time: string) =>
              time.trim()
          )
          .filter(
            (time: string) =>
              time.length > 0
          ),
      isActive: formValue.isActive
    };

    this.api
      .updateDoctor(
        this.doctorId,
        doctorData
      )
      .subscribe({
        next: () => {
          this.successMessage =
            'Doctor updated successfully.';

          this.isSaving = false;

          this.cd.detectChanges();

          setTimeout(() => {
            this.router.navigate([
              '/admin-doctor-details',
              this.doctorId
            ]);
          }, 1000);
        },

        error: (error) => {
          console.error(
            'Doctor update error:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            'Unable to update doctor.';

          this.isSaving = false;

          this.cd.detectChanges();
        }
      });
  }

  cancel(): void {
    this.router.navigate([
      '/admin-doctor-details',
      this.doctorId
    ]);
  }

  get name() {
    return this.editDoctorForm.get('name');
  }

  get email() {
    return this.editDoctorForm.get('email');
  }

  get specialization() {
    return this.editDoctorForm.get(
      'specialization'
    );
  }

  get phone() {
    return this.editDoctorForm.get('phone');
  }

}
