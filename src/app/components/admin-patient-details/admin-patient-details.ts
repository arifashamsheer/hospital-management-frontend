import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Patient } from '../../models/patient';
import { ActivatedRoute, Router } from '@angular/router';
import { Apiservice } from '../../services/apiservice';
import { Appointment } from '../../models/appointment';

@Component({
  selector: 'app-admin-patient-details',
  standalone: false,
  templateUrl: './admin-patient-details.html',
  styleUrl: './admin-patient-details.css',
})
export class AdminPatientDetails implements OnInit {

  patient?: Patient;

  appointments: Appointment[] = [];

  isLoadingPatient = false;
  isLoadingAppointments = false;

  patientError = '';
  appointmentError = '';

  displayedColumns: string[] = [
    'doctor',
    'specialization',
    'date',
    'time',
    'reason',
    'status'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: Apiservice,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id =
      this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.patientError =
        'Patient ID was not found.';
      return;
    }

    this.loadPatient(id);
    this.loadAppointments(id);
  }

  loadPatient(id: string): void {
    this.isLoadingPatient = true;
    this.patientError = '';

    this.api.getPatientById(id)
      .subscribe({
        next: (data) => {
          this.patient = data;
          this.isLoadingPatient = false;
          this.cd.detectChanges();
        },

        error: (err) => {
          console.error(err);

          this.patientError =
            err.error?.message ||
            'Unable to load patient details.';

          this.isLoadingPatient = false;
          this.cd.detectChanges();
        }
      });
  }

  loadAppointments(id: string): void {
    this.isLoadingAppointments = true;
    this.appointmentError = '';

    this.api.getPatientAppointments(id)
      .subscribe({
        next: (data: any) => {
          this.appointments =
            data.appointments ??
            data.data ??
            data ??
            [];

          this.isLoadingAppointments = false;
          this.cd.detectChanges();
        },

        error: (err) => {
          console.error(err);

          this.appointmentError =
            err.error?.message ||
            'Unable to load appointment history.';

          this.isLoadingAppointments = false;
          this.cd.detectChanges();
        }
      });
  }

  goBack(): void {
    this.router.navigate([
      '/admin-patients'
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
  status?: string
): string {
  return status
    ? status.toLowerCase()
    : '';
}
}



