import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Appointment } from '../../models/appointment';
import { Apiservice } from '../../services/apiservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-appointments',
  standalone: false,
  templateUrl: './my-appointments.html',
  styleUrl: './my-appointments.css',
})
export class MyAppointments implements OnInit{

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
private cd:ChangeDetectorRef,private router: Router,
){}



ngOnInit(){

this.loadAppointments();

}



loadAppointments(){
   this.isLoading = true;

this.apiService.getAppointments()
.subscribe({next:(result:any)=>{

this.appointments=result.appointments ?? result.data ?? result ?? [];
 this.isLoading = false;
        this.cd.detectChanges();
this.cd.detectChanges();

},


      error: (error) => {
        console.error(
          'Appointment loading error:',
          error
        );

        this.isLoading = false;
        this.cd.detectChanges();

        alert(
          error.error?.message ||
          'Unable to load appointments'
        );
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


