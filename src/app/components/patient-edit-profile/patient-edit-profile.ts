import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Patient } from '../../models/patient';
import { Apiservice } from '../../services/apiservice';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-patient-edit-profile',
  standalone: false,
  templateUrl: './patient-edit-profile.html',
  styleUrl: './patient-edit-profile.css',
})
// export class PatientEditProfile  implements OnInit {

//   patient!: Patient;

//   constructor(
//     private api: Apiservice,
//     private router: Router,
//     private cd: ChangeDetectorRef
//   ) {}

//   ngOnInit(): void {
//     this.loadPatient();
//   }

//   loadPatient(): void {
//     this.api.getMyProfile().subscribe({
//       next: (data) => {
//         this.patient = data;
//         this.cd.detectChanges();
//       },
//       error: (err) => {
//         console.error('Profile loading error:', err);
//       }
//     });
//   }

//   updateProfile(): void {
//     this.api.updateMyProfile(this.patient).subscribe({
//       next: () => {
//         alert('Profile updated successfully');
//         this.router.navigate(['/patient-profile']);
//       },
//       error: (err) => {
//         console.error('Profile update error:', err);
//         alert(err.error?.message || 'Update failed');
//       }
//     });
//   }

//   goBack(): void {
//     this.router.navigate(['/patient-profile']);
//   }
 export class PatientEditProfile  implements OnInit {

  profileForm!: FormGroup;
  isLoading = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private api: Apiservice,
    private router: Router,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.loadPatientProfile();
  }

  createForm(): void {
    this.profileForm = this.fb.group({
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

      age: [
        '',
        [
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
          Validators.pattern(/^[0-9+\-\s]{7,15}$/)
        ]
      ],

      medicalHistory: [
        '',
        Validators.maxLength(1000)
      ]
    });
  }

  loadPatientProfile(): void {
    this.isLoading = true;

    this.api.getMyProfile().subscribe({
      next: (patient) => {
        this.profileForm.patchValue({
          name: patient.name,
          email: patient.email,
          age: patient.age,
          gender: patient.gender,
          phone: patient.phone,
          medicalHistory: patient.medicalHistory,
          
        });

        this.isLoading = false;
         this.cd.detectChanges();
      },

      error: (error) => {
        console.error('Profile loading error:', error);

       this.dialog.open(
  ConfirmDialog,
  {
    width: '360px',
    maxWidth: '90vw',

    data: {
      title:
        'Unable to load profile',

      message:
        error.error?.message ||
        'Your profile information could not be loaded.',

      confirmText:
        'Close',

      cancelText:
        '',

      icon:
        'error_outline'
    }
  }
);

        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  updateProfile(): void {

  if (this.profileForm.invalid) {
    this.profileForm.markAllAsTouched();
    return;
  }

  const dialogRef =
    this.dialog.open(
      ConfirmDialog,
      {
        width: '360px',
        maxWidth: '90vw',
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
saveProfile(): void {

  this.isSubmitting = true;

  const updatedPatient =
    this.profileForm.getRawValue();

  this.api
    .updateMyProfile(
      updatedPatient
    )
    .subscribe({

      next: () => {

        this.isSubmitting = false;

        const successDialog =
          this.dialog.open(
            ConfirmDialog,
            {
              width: '360px',
              maxWidth: '90vw',
              disableClose: true,

              data: {
                title:
                  'Profile updated',

                message:
                  'Your profile information was updated successfully.',

                confirmText:
                  'OK',

                cancelText:
                  '',

                icon:
                  'check_circle'
              }
            }
          );

        successDialog
          .afterClosed()
          .subscribe(() => {

            this.router.navigate([
              '/patient-profile'
            ]);

          });
      },

      error: (error) => {

        console.error(
          'Profile update error:',
          error
        );

        this.isSubmitting = false;

        this.dialog.open(
          ConfirmDialog,
          {
            width: '360px',
            maxWidth: '90vw',

            data: {
              title:
                'Update failed',

              message:
                error.error?.message ||
                'Unable to update your profile.',

              confirmText:
                'Close',

              cancelText:
                '',

              icon:
                'error_outline'
            }
          }
        );

        this.cd.detectChanges();
      }
    });
}

  goBack(): void {
    this.router.navigate([
      '/patient-profile'
    ]);
  }

  get name() {
    return this.profileForm.get('name');
  }

  get email() {
    return this.profileForm.get('email');
  }

  get age() {
    return this.profileForm.get('age');
  }

  get gender() {
    return this.profileForm.get('gender');
  }

  get phone() {
    return this.profileForm.get('phone');
  }

  get medicalHistory() {
    return this.profileForm.get('medicalHistory');
  }
}
