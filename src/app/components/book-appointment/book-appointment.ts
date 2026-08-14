import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Doctor } from '../../models/doctor';
import { Apiservice } from '../../services/apiservice';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-book-appointment',
  standalone: false,
  templateUrl: './book-appointment.html',
  styleUrl: './book-appointment.css',
})
export class BookAppointment implements OnInit {

  appointmentForm!: FormGroup;

  doctors: any[] = [];
  selectedDoctor: any = null;
  availableTimes: string[] = [];

  isLoadingDoctors = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private api: Apiservice,
    private router: Router,private cd:ChangeDetectorRef,
  private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.loadDoctors();
  }

  createForm(): void {
    this.appointmentForm = this.fb.group({
      doctorId: ['', Validators.required],

      appointmentDate: [
        '',
        Validators.required
      ],

      appointmentTime: [
        {
          value: '',
          disabled: true
        },
        Validators.required
      ],

      reason: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(500)
        ]
      ]
    });
  }

  loadDoctors(): void {
    this.isLoadingDoctors = true;

    this.api.getDoctors().subscribe({
      next: (response: any) => {
        const doctors =
          response.doctors ??
          response.data ??
          response;

        this.doctors = doctors.filter(
          (doctor: any) =>
            doctor.isActive !== false
        );

        this.isLoadingDoctors = false;
         this.cd.detectChanges();
      },

      error: (error) => {
        console.error(
          'Doctor loading error:',
          error
        );

        this.isLoadingDoctors = false;
        this.cd.detectChanges();

        this.dialog.open(
  ConfirmDialog,
  {
    width: '360px',
    maxWidth: '90vw',

    data: {
      title:
        'Unable to load doctors',

      message:
        error.error?.message ||
        'Doctor information could not be loaded.',

      confirmText:
        'Close',

      cancelText:
        '',

      icon:
        'error_outline'
    }
  }
);
      }
    });
  }

  onDoctorChange(doctorId: string): void {
    this.selectedDoctor = this.doctors.find(
      (doctor: any) =>
        doctor._id === doctorId
    );

    this.availableTimes =
      this.selectedDoctor?.availability ?? [];

    const timeControl =
      this.appointmentForm.get(
        'appointmentTime'
      );

    timeControl?.reset();

    if (this.availableTimes.length > 0) {
      timeControl?.enable();
    } else {
      timeControl?.disable();
    }
  }

  bookAppointment(): void {

  if (this.appointmentForm.invalid) {
    this.appointmentForm.markAllAsTouched();
    return;
  }

  const formValue =
    this.appointmentForm.getRawValue();

  const selectedDoctor =
    this.doctors.find(
      doctor =>
        doctor._id === formValue.doctorId
    );

  const doctorName =
    selectedDoctor?.name ||
    'the selected doctor';

  const dialogRef =
    this.dialog.open(
      ConfirmDialog,
      {
        width: '360px',
        maxWidth: '90vw',
        disableClose: true,

        data: {
          title: 'Book appointment?',

          message:
            `Do you want to book an appointment with Dr. ${doctorName} on ${this.formatDate(formValue.appointmentDate)} at ${formValue.appointmentTime}?`,

          confirmText: 'Book',

          cancelText: 'Cancel',

          icon: 'event_available'
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

        this.submitAppointment();
      }
    );
}
submitAppointment(): void {

  this.isSubmitting = true;

  const formValue =
    this.appointmentForm.getRawValue();

  const appointmentData = {
    doctorId:
      formValue.doctorId,

    date:
      formValue.appointmentDate,

    time:
      formValue.appointmentTime,

    reason:
      formValue.reason
  };

  this.api
    .bookAppointment(
      appointmentData
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
                  'Appointment booked',

                message:
                  'Your appointment was booked successfully.',

                confirmText:
                  'View Appointments',

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
              '/my-appointments'
            ]);

          });
      },

      error: (error) => {

        console.error(
          'Appointment booking error:',
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
                'Booking failed',

              message:
                error.error?.message ||
                'Unable to book the appointment.',

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
formatDate(
  dateValue: string | Date
): string {

  if (!dateValue) {
    return '';
  }

  const date =
    new Date(dateValue);

  return date.toLocaleDateString(
    'en-GB',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }
  );
}
  goBack(): void {
    this.router.navigate([
      '/patient-dashboard'
    ]);
  }

  get doctorId() {
    return this.appointmentForm.get(
      'doctorId'
    );
  }

  get appointmentDate() {
    return this.appointmentForm.get(
      'appointmentDate'
    );
  }

  get appointmentTime() {
    return this.appointmentForm.get(
      'appointmentTime'
    );
  }

  get reason() {
    return this.appointmentForm.get(
      'reason'
    );
  }
}
