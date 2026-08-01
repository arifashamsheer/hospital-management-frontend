import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { Apiservice } from '../../services/apiservice';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: false,
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.css',
})
export class DoctorDashboard implements OnInit {

  appointments: any[] = [];
  todayAppointments: any[] = [];

  todayCount = 0;
  pendingCount = 0;
  completedCount = 0;
  totalPatients = 0;

  isLoading = false;
  errorMessage = '';

  displayedColumns: string[] = [
    'patient',
    'time',
    'reason',
    'status'
  ];

  constructor(
    private apiService: Apiservice,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}
  
   ngOnInit(): void {
    this.loadDashboard();
  }

loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getAppointments().subscribe({
      next: (response: any) => {
        this.appointments =
          response.appointments ??
          response.data ??
          response ??
          [];

        this.calculateDashboardStats();

        this.isLoading = false;
        this.cd.detectChanges();
      },

      error: (error) => {
        console.error(
          'Doctor dashboard loading error:',
          error
        );

        this.errorMessage =
          error.error?.message ||
          'Unable to load doctor dashboard';

        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }
calculateDashboardStats(): void {
    const today = this.getLocalDateString(
      new Date()
    );

    this.todayAppointments =
      this.appointments.filter(
        (appointment: any) => {
          const appointmentDate =
            this.getLocalDateString(
              new Date(appointment.date)
            );

          return appointmentDate === today;
        }
      );

    this.todayAppointments.sort(
      (first: any, second: any) =>
        this.convertTimeToMinutes(first.time) -
        this.convertTimeToMinutes(second.time)
    );

    this.todayCount =
      this.todayAppointments.length;

    this.pendingCount =
      this.appointments.filter(
        (appointment: any) =>
          appointment.status === 'Pending'
      ).length;

    this.completedCount =
      this.todayAppointments.filter(
        (appointment: any) =>
          appointment.status === 'Completed'
      ).length;

    const patientIds = new Set<string>();

    this.appointments.forEach(
      (appointment: any) => {
        const patientId =
          appointment.patientId?._id ??
          appointment.patientId;

        if (patientId) {
          patientIds.add(patientId);
        }
      }
    );

    this.totalPatients = patientIds.size;
  }

  getLocalDateString(date: Date): string {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  convertTimeToMinutes(time: string): number {
    if (!time) {
      return 0;
    }

    const normalizedTime =
      time.trim().toUpperCase();

    const timeParts =
      normalizedTime.match(
        /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/
      );

    if (!timeParts) {
      return 0;
    }

    let hours = Number(timeParts[1]);
    const minutes = Number(timeParts[2]);
    const period = timeParts[3];

    if (period === 'PM' && hours !== 12) {
      hours += 12;
    }

    if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  }

  getPatientName(
    appointment: any
  ): string {
    return (
      appointment.patientId?.name ||
      'Patient unavailable'
    );
  }

  getStatusClass(
    status: string
  ): string {
    return status
      ? status.toLowerCase()
      : '';
  }

  viewAppointments(): void {
    this.router.navigate([
      '/doctor-appointments'
    ]);
  }

  viewProfile(): void {
    this.router.navigate([
      '/doctor-profile'
    ]);
  }




}
