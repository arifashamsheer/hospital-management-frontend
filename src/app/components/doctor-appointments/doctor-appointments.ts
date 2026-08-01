import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Appointment } from '../../models/appointment';
import { Apiservice } from '../../services/apiservice';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-doctor-appointments',
  standalone: false,
  templateUrl: './doctor-appointments.html',
  styleUrl: './doctor-appointments.css',
})
export class DoctorAppointments implements OnInit{

   appointments: any[] = [];
  filteredAppointments: any[] = [];

  isLoading = false;
  updatingId: string | null = null;
  errorMessage = '';

  searchControl = new FormControl('');
  statusControl = new FormControl('All');

  displayedColumns: string[] = [
    'patient',
    'date',
    'time',
    'reason',
    'status',
    'actions'
  ];

  constructor(private api: Apiservice,private cd:ChangeDetectorRef){}

  ngOnInit(): void {
    this.loadAppointments();

    this.searchControl.valueChanges.subscribe(
      () => {
        this.applyFilters();
      }
    );

    this.statusControl.valueChanges.subscribe(
      () => {
        this.applyFilters();
      }
    );
  }


  loadAppointments(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.api.getAppointments().subscribe({
      next: (response: any) => {
        /*
         * Supports all common backend response formats:
         *
         * [appointment1, appointment2]
         *
         * { appointments: [...] }
         *
         * { data: [...] }
         */
        this.appointments =
          response.appointments ??
          response.data ??
          response ??
          [];

        console.log(
          'Doctor appointments:',
          this.appointments
        );

        this.sortAppointments();
        this.applyFilters();

        this.isLoading = false;
        this.cd.detectChanges();
      },

      error: (error) => {
        console.error(
          'Appointment loading error:',
          error
        );

        this.errorMessage =
          error.error?.message ||
          'Unable to load appointments';

        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  
  applyFilters(): void {
    const searchValue =
      this.searchControl.value
        ?.trim()
        .toLowerCase() ?? '';

    const selectedStatus =
      this.statusControl.value ?? 'All';

    this.filteredAppointments =
      this.appointments.filter(
        (appointment: any) => {
          const patientName =
            appointment.patientId?.name
              ?.toLowerCase() ?? '';

          const patientEmail =
            appointment.patientId?.email
              ?.toLowerCase() ?? '';

          const reason =
            appointment.reason
              ?.toLowerCase() ?? '';

          const matchesSearch =
            patientName.includes(searchValue) ||
            patientEmail.includes(searchValue) ||
            reason.includes(searchValue);

          const matchesStatus =
            selectedStatus === 'All' ||
            appointment.status === selectedStatus;

          return matchesSearch && matchesStatus;
        }
      );

    this.cd.detectChanges();
  }

  sortAppointments(): void {
    this.appointments.sort(
      (first: any, second: any) => {
        const firstDate =
          this.getAppointmentDateTime(first);

        const secondDate =
          this.getAppointmentDateTime(second);

        return firstDate - secondDate;
      }
    );
  }

  getAppointmentDateTime(
    appointment: any
  ): number {
    const dateValue =
      appointment.date?.split('T')[0] ?? '';

    const timeValue =
      this.convertTo24HourTime(
        appointment.time
      );

    const dateTime = new Date(
      `${dateValue}T${timeValue}:00`
    );

    return isNaN(dateTime.getTime())
      ? 0
      : dateTime.getTime();
  }

  convertTo24HourTime(
    time: string
  ): string {
    if (!time) {
      return '00:00';
    }

    const value = time.trim().toUpperCase();

    const match = value.match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/
    );

    if (!match) {
      return '00:00';
    }

    let hours = Number(match[1]);
    const minutes = match[2];
    const period = match[3];

    if (
      period === 'PM' &&
      hours !== 12
    ) {
      hours += 12;
    }

    if (
      period === 'AM' &&
      hours === 12
    ) {
      hours = 0;
    }

    return `${String(hours).padStart(
      2,
      '0'
    )}:${minutes}`;
  }

  updateStatus(
    appointment: any,
    status: string
  ): void {
    let confirmationMessage =
      'Update this appointment?';

    if (status === 'Approved') {
      confirmationMessage =
        'Are you sure you want to approve this appointment?';
    }

    if (status === 'Completed') {
      confirmationMessage =
        'Are you sure you want to mark this appointment as completed?';
    }

    if (status === 'Cancelled') {
      confirmationMessage =
        'Are you sure you want to cancel this appointment?';
    }

    const confirmed = confirm(
      confirmationMessage
    );

    if (!confirmed) {
      return;
    }

    this.updatingId = appointment._id;

    this.api
      .updateAppointmentStatus(
        appointment._id,
        status
      )
      .subscribe({
        next: (response: any) => {
          appointment.status =
            response.appointment?.status ??
            response.status ??
            status;

          this.updatingId = null;

          this.applyFilters();
          this.cd.detectChanges();

          alert(
            `Appointment ${status.toLowerCase()} successfully`
          );
        },

        error: (error) => {
          console.error(
            'Appointment update error:',
            error
          );

          this.updatingId = null;
          this.cd.detectChanges();

          alert(
            error.error?.message ||
            'Unable to update appointment'
          );
        }
      });
  }

  canApprove(
    appointment: any
  ): boolean {
    return appointment.status === 'Pending';
  }

  canComplete(
    appointment: any
  ): boolean {
    return appointment.status === 'Approved';
  }

  canCancel(
    appointment: any
  ): boolean {
    return (
      appointment.status !== 'Cancelled' &&
      appointment.status !== 'Completed'
    );
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
}
