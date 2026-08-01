import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Doctor } from '../../models/doctor';
import { Apiservice } from '../../services/apiservice';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private router: Router,private cd:ChangeDetectorRef
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

        alert(
          error.error?.message ||
          'Unable to load doctors'
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

  this.isSubmitting = true;

  const formValue =
    this.appointmentForm.getRawValue();

  const appointmentData = {
    doctorId: formValue.doctorId,
    date: formValue.appointmentDate,
    time: formValue.appointmentTime,
    reason: formValue.reason
  };

  console.log(
    'Appointment data:',
    appointmentData
  );

  this.api.bookAppointment(
    appointmentData
  ).subscribe({
    next: () => {
      this.isSubmitting = false;

      alert(
        'Appointment booked successfully'
      );

      this.router.navigate([
        '/my-appointments'
      ]);
    },

    error: (error) => {
      console.error(
        'Appointment booking error:',
        error
      );

      this.isSubmitting = false;

      alert(
        error.error?.message ||
        'Appointment booking failed'
      );
    }
  });
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
