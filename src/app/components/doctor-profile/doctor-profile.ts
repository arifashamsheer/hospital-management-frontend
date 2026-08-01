import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Doctor } from '../../models/doctor';
import { Apiservice } from '../../services/apiservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-profile',
  standalone: false,
  templateUrl: './doctor-profile.html',
  styleUrl: './doctor-profile.css',
})
export class DoctorProfile implements OnInit {

  doctor?: Doctor;

  isLoading = false;
  errorMessage = '';

  constructor(
    private api: Apiservice,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.api.getDoctorProfile().subscribe({
       next: (data: Doctor) => {
      this.doctor = data;

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

  editProfile(): void {
    this.router.navigate([
      '/edit-doctor-profile'
    ]);
  }

  goToAppointments(): void {
    this.router.navigate([
      '/doctor-appointments'
    ]);
  }

  getAvailability(): string[] {
    if (
      Array.isArray(
        this.doctor?.availability
      )
    ) {
      return this.doctor.availability;
    }

    return [];
  }
}
