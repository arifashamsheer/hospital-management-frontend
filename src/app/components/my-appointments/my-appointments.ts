import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Appointment } from '../../models/appointment';
import { Apiservice } from '../../services/apiservice';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-my-appointments',
  standalone: false,
  templateUrl: './my-appointments.html',
  styleUrl: './my-appointments.css',
})
export class MyAppointments implements OnInit{
  payments: any[] = [];

   appointments: any[] = [];

  isLoading = false;
  cancellingId: string | null = null;

   displayedColumns: string[] = [
    'doctor',
    'specialization',
    'date',
    'time',
    'reason',
    'status',
    'actions'
  ];


constructor(
private apiService:Apiservice,
private cd:ChangeDetectorRef,private router: Router, private paymentService: PaymentService,
){}



ngOnInit(){

this.loadAppointments();

}



loadAppointments(): void {
  this.isLoading = true;

  forkJoin({
    appointments:
      this.apiService.getMyAppointments(),

    payments:
      this.paymentService.getMyPayments()
  })
  .subscribe({
    next: ({
      appointments,
      payments
    }) => {

      this.payments = payments ?? [];

      this.appointments =
        (appointments ?? []).map(
          appointment => {

            const payment =
              this.payments.find(
                item => {

                  const paymentAppointmentId =
                    typeof item.appointmentId ===
                    'object'
                      ? item.appointmentId?._id
                      : item.appointmentId;

                  return (
                    paymentAppointmentId ===
                    appointment._id
                  );
                }
              );

            return {
              ...appointment,

              paymentStatus:
                payment?.paymentStatus ??
                'Unpaid'
            };
          }
        );

      this.isLoading = false;
      this.cd.detectChanges();
    },

    error: error => {
      console.error(
        'Appointments loading error:',
        error
      );

      this.isLoading = false;
      this.cd.detectChanges();
    }
  });
}


cancelAppointment(
    appointment: any
  ): void {
    if (
      appointment.status === 'Cancelled' ||
      appointment.status === 'Completed'
    ) {
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to cancel this appointment?'
    );

    if (!confirmed) {
      return;
    }

    this.cancellingId = appointment._id;

    this.apiService
      .cancelAppointment(appointment._id)
      .subscribe({
        next: () => {
          appointment.status = 'Cancelled';
          this.cancellingId = null;

          this.cd.detectChanges();

          alert(
            'Appointment cancelled successfully'
          );
        },

        error: (error) => {
          console.error(
            'Appointment cancellation error:',
            error
          );

          this.cancellingId = null;
          this.cd.detectChanges();

          alert(
            error.error?.message ||
            'Unable to cancel appointment'
          );
        }
      });
  }

  bookNewAppointment(): void {
    this.router.navigate([
      '/book-appointment'
    ]);
  }

  getDoctorName(
    appointment: any
  ): string {
    return (
      appointment.doctorId?.name ||
      'Doctor unavailable'
    );
  }

  getSpecialization(
    appointment: any
  ): string {
    return (
      appointment.doctorId
        ?.specialization ||
      'Not available'
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


