import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Doctor } from '../../models/doctor';
import { Apiservice } from '../../services/apiservice';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-doctor-profile',
  standalone: false,
  templateUrl: './edit-doctor-profile.html',
  styleUrl: './edit-doctor-profile.css',
})
export class EditDoctorProfile implements OnInit {

  doctor?: Doctor;

  doctorForm!: FormGroup;

  isLoading = false;
  isSaving = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private api: Apiservice,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadDoctor();
  }

  createForm(): void {
    this.doctorForm =
      this.formBuilder.group({
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3)
          ]
        ],

        email: [
          {
            value: '',
            disabled: true
          },
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

        specialization: [
          '',
          [
            Validators.required,
            Validators.minLength(3)
          ]
        ],

        availability:
          this.formBuilder.array([])
      });
  }

  get availability(): FormArray {
    return this.doctorForm.get(
      'availability'
    ) as FormArray;
  }

  loadDoctor(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.api.getDoctorProfile().subscribe({
      next: (data: Doctor) => {
        this.doctor = data;

        this.doctorForm.patchValue({
          name: data.name,
          email: data.email,
          phone: data.phone ?? '',
          specialization:
            data.specialization ?? ''
        });

        this.availability.clear();

        const slots =
          data.availability ?? [];

        if (slots.length > 0) {
          slots.forEach((slot: string) => {
            this.addSlot(slot);
          });
        } else {
          this.addSlot();
        }

        this.isLoading = false;
        this.cd.detectChanges();
      },

      error: (error) => {
        console.error(
          'Doctor profile loading error:',
          error
        );

        this.errorMessage =
          error.error?.message ||
          'Unable to load doctor profile';

        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  addSlot(
    value: string = ''
  ): void {
    this.availability.push(
      this.formBuilder.control(
        value,
        Validators.required
      )
    );
  }

  removeSlot(index: number): void {
    this.availability.removeAt(index);

    if (this.availability.length === 0) {
      this.addSlot();
    }
  }

  updateProfile(): void {
  if (this.doctorForm.invalid) {
    this.doctorForm.markAllAsTouched();
    return;
  }

  const formValue =
    this.doctorForm.getRawValue() as {
      name: string;
      email: string;
      phone: string;
      specialization: string;
      availability: string[];
    };

  const cleanedSlots: string[] =
    formValue.availability
      .map((slot: string) => slot.trim())
      .filter((slot: string) => slot !== '');

  const uniqueSlots: string[] = [
    ...new Set<string>(cleanedSlots)
  ];

  const updateData: Partial<Doctor> = {
    name: formValue.name.trim(),
    phone: formValue.phone.trim(),
    specialization:
      formValue.specialization.trim(),
    availability: uniqueSlots
  };

  this.isSaving = true;

  this.api
    .updateDoctorProfile(updateData)
    .subscribe({
      next: (updatedDoctor: Doctor) => {
        this.isSaving = false;

        alert(
          'Profile updated successfully'
        );

        this.router.navigate([
          '/doctor-profile'
        ]);
      },

      error: (error) => {
        console.error(
          'Profile update error:',
          error
        );

        this.isSaving = false;
        this.cd.detectChanges();

        alert(
          error.error?.message ||
          'Update failed'
        );
      }
    });
}

  cancel(): void {
    this.router.navigate([
      '/doctor-profile'
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
