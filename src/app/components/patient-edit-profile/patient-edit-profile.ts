import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Patient } from '../../models/patient';
import { Apiservice } from '../../services/apiservice';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private router: Router,private cd: ChangeDetectorRef
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

        alert(
          error.error?.message ||
          'Unable to load profile'
        );

        this.isLoading = false;
      }
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const updatedPatient = this.profileForm.getRawValue();

    this.api.updateMyProfile(updatedPatient).subscribe({
      next: () => {
        alert('Profile updated successfully');

        this.router.navigate([
          '/patient-profile'
        ]);
      },

      error: (error) => {
        console.error('Profile update error:', error);

        alert(
          error.error?.message ||
          'Profile update failed'
        );

        this.isSubmitting = false;
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
