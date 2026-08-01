import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Appointment } from '../../models/appointment';
import { Apiservice } from '../../services/apiservice';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-appointments',
  standalone: false,
  templateUrl: './admin-appointments.html',
  styleUrl: './admin-appointments.css',
})
export class AdminAppointments  implements OnInit, AfterViewInit {

  appointments: Appointment[] = [];

  dataSource =
    new MatTableDataSource<Appointment>([]);

  displayedColumns: string[] = [
    'patient',
    'doctor',
    'date',
    'time',
    'reason',
    'status',
    'actions'
  ];

  searchValue = '';

  isLoading = false;
  errorMessage = '';

  updatingAppointmentId = '';

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private api: Apiservice,
    private cd: ChangeDetectorRef,
  private router: Router
  ) {}

  ngOnInit(): void {
    this.configureFilter();
    this.loadAppointments();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator =
      this.paginator;
  }

  configureFilter(): void {
    this.dataSource.filterPredicate = (
      appointment: Appointment,
      filter: string
    ) => {
      const searchText =
        filter.trim().toLowerCase();

      const patientName =
        typeof appointment.patientId === 'object'
          ? appointment.patientId?.name
          : '';

      const doctorName =
        typeof appointment.doctorId === 'object'
          ? appointment.doctorId?.name
          : '';

      const appointmentData = [
        patientName,
        doctorName,
        appointment.date,
        appointment.time,
        appointment.reason,
        appointment.status
      ]
        .filter(
          value =>
            value !== null &&
            value !== undefined
        )
        .join(' ')
        .toLowerCase();

      return appointmentData.includes(
        searchText
      );
    };
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.cd.detectChanges();

    this.api.getAppointments()
      .subscribe({
        next: (response: any) => {
          console.log(
            'Appointments response:',
            response
          );

          this.appointments =
            response.appointments ??
            response.data ??
            response ??
            [];

          this.dataSource.data =
            this.appointments;

          this.isLoading = false;

          this.cd.detectChanges();

          if (this.paginator) {
            this.dataSource.paginator =
              this.paginator;
          }
        },

        error: (error) => {
          console.error(
            'Appointment loading error:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            'Unable to load appointments.';

          this.isLoading = false;

          this.cd.detectChanges();
        }
      });
  }

  applyFilter(event: Event): void {
    const input =
      event.target as HTMLInputElement;

    this.searchValue =
      input.value;

    this.dataSource.filter =
      input.value
        .trim()
        .toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator
        .firstPage();
    }
  }

  clearSearch(): void {
    this.searchValue = '';
    this.dataSource.filter = '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator
        .firstPage();
    }
  }

  changeStatus(
    appointment: Appointment,
    status: string
  ): void {
    if (!appointment._id) {
      return;
    }

    const confirmed = confirm(
      `Change appointment status to ${status}?`
    );

    if (!confirmed) {
      return;
    }

    this.updatingAppointmentId =
      appointment._id;

    this.api
      .updateAppointmentStatus(
        appointment._id,
        status
      )
      .subscribe({
        next: () => {
          appointment.status =
            status;

          this.updatingAppointmentId = '';

          this.dataSource.data = [
            ...this.appointments
          ];

          this.cd.detectChanges();
        },

        error: (error) => {
          console.error(
            'Appointment status error:',
            error
          );

          alert(
            error.error?.message ||
            'Unable to update appointment status.'
          );

          this.updatingAppointmentId = '';

          this.cd.detectChanges();
        }
      });
  }

  getPatientName(
    appointment: Appointment
  ): string {
    if (
      appointment.patientId &&
      typeof appointment.patientId ===
        'object'
    ) {
      return appointment.patientId.name ||
        'Unknown patient';
    }

    return 'Unknown patient';
  }

  getDoctorName(
    appointment: Appointment
  ): string {
    if (
      appointment.doctorId &&
      typeof appointment.doctorId ===
        'object'
    ) {
      return appointment.doctorId.name ||
        'Not assigned';
    }

    return 'Not assigned';
  }

  getInitials(name?: string): string {
    if (!name) {
      return 'NA';
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

  getStatusClass(
    status?: string
  ): string {
    switch (
      status?.toLowerCase()
    ) {
      case 'approved':
        return 'approved-status';

      case 'completed':
        return 'completed-status';

      case 'cancelled':
        return 'cancelled-status';

      default:
        return 'pending-status';
    }
  }
  viewAppointment(id?: string): void {
  if (!id) {
    return;
  }

  this.router.navigate([
    '/admin-appointment-details',
    id
  ]);
}


}
