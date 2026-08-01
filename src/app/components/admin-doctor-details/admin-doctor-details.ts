import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Apiservice } from '../../services/apiservice';
import { ActivatedRoute, Router } from '@angular/router';
import { Doctor } from '../../models/doctor';

@Component({
  selector: 'app-admin-doctor-details',
  standalone: false,
  templateUrl: './admin-doctor-details.html',
  styleUrl: './admin-doctor-details.css',
})
export class AdminDoctorDetails implements OnInit {

  doctor?: Doctor;

  doctorId = '';

  isLoading = false;
  isUpdatingStatus = false;

  errorMessage = '';

  constructor(
    private api: Apiservice,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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

  loadDoctor(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.cd.detectChanges();

    this.api
      .getDoctorById(this.doctorId)
      .subscribe({
        next: (response: any) => {
          console.log(
            'Doctor details response:',
            response
          );

          this.doctor =
            response.doctor ??
            response.data ??
            response;

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

  changeStatus(): void {
    if (!this.doctor?._id) {
      return;
    }

    const newStatus =
      !this.doctor.isActive;

    const message =
      newStatus
        ? `Activate Dr. ${this.doctor.name}?`
        : `Deactivate Dr. ${this.doctor.name}?`;

    if (!confirm(message)) {
      return;
    }

    this.isUpdatingStatus = true;

    this.api
      .updateDoctorStatus(
        this.doctor._id,
        newStatus
      )
      .subscribe({
        next: () => {
          if (this.doctor) {
            this.doctor.isActive =
              newStatus;
          }

          this.isUpdatingStatus = false;

          this.cd.detectChanges();
        },

        error: (error) => {
          console.error(
            'Doctor status update error:',
            error
          );

          alert(
            error.error?.message ||
            'Unable to update doctor status.'
          );

          this.isUpdatingStatus = false;

          this.cd.detectChanges();
        }
      });
  }

  editDoctor(): void {
    if (!this.doctor?._id) {
      return;
    }

    this.router.navigate([
      '/edit-doctor',
      this.doctor._id
    ]);
  }

  backToDoctors(): void {
    this.router.navigate([
      '/admin-doctors'
    ]);
  }

  getInitials(name?: string): string {
    if (!name) {
      return 'DR';
    }

    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(
        word =>
          word.charAt(0)
      )
      .join('')
      .toUpperCase();
  }

  getAvailability(): string {
    if (
      !this.doctor?.availability ||
      this.doctor.availability.length === 0
    ) {
      return 'Not provided';
    }

    return this.doctor.availability.join(', ');
  }

}
