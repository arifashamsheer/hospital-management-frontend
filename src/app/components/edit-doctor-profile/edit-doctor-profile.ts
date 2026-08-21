import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Doctor } from '../../models/doctor';
import { Apiservice } from '../../services/apiservice';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog
} from '@angular/material/dialog';

import {
  ConfirmDialog
} from '../confirm-dialog/confirm-dialog';

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
    private cd: ChangeDetectorRef,
  private dialog: MatDialog
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

  const dialogRef =
    this.dialog.open(
      ConfirmDialog,
      {
        width: '380px',
        disableClose: true,

        data: {
          title: 'Update profile?',
          message:
            'Do you want to save the changes made to your profile?',
          confirmText: 'Update',
          cancelText: 'Cancel',
          icon: 'person'
        }
      }
    );


  dialogRef
    .afterClosed()
    .subscribe(
      confirmed => {

        if (!confirmed) {
          return;
        }

        this.saveProfile();
      }
    );
}
private saveProfile(): void {

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
      .map(
        (slot: string) =>
          slot.trim()
      )
      .filter(
        (slot: string) =>
          slot !== ''
      );


  const uniqueSlots: string[] = [
    ...new Set<string>(
      cleanedSlots
    )
  ];


  const updateData:
    Partial<Doctor> = {

      name:
        formValue.name.trim(),

      phone:
        formValue.phone.trim(),

      specialization:
        formValue.specialization.trim(),

      availability:
        uniqueSlots
    };


  this.isSaving = true;


  this.api
    .updateDoctorProfile(
      updateData
    )
    .subscribe({

      next: (
        updatedDoctor: Doctor
      ) => {

        this.isSaving = false;

        this.cd.detectChanges();


        const successDialog =
          this.dialog.open(
            ConfirmDialog,
            {
              width: '380px',
              disableClose: true,

              data: {
                title:
                  'Profile Updated!',
                message:
                  'Your profile has been updated successfully.',
                confirmText:
                  'OK',
                cancelText:
                  'Close',
                icon:
                  'check_circle'
              }
            }
          );


        successDialog
          .afterClosed()
          .subscribe(() => {

            this.router.navigate([
              '/doctor-profile'
            ]);

          });

      },


      error: (error) => {

        console.error(
          'Profile update error:',
          error
        );

        this.isSaving = false;

        this.cd.detectChanges();


        this.dialog.open(
          ConfirmDialog,
          {
            width: '380px',

            data: {
              title:
                'Update Failed',
              message:
                error.error?.message ||
                'Unable to update your profile.',
              confirmText:
                'OK',
              cancelText:
                'Close',
              icon:
                'error_outline'
            }
          }
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
