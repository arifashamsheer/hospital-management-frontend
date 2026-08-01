import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Patient } from '../../models/patient';
import { Doctor } from '../../models/doctor';
import { Apiservice } from '../../services/apiservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-appointment',
  standalone: false,
  templateUrl: './add-appointment.html',
  styleUrl: './add-appointment.css',
})
export class AddAppointment implements OnInit {

  appointmentForm!: FormGroup;

  patients: Patient[] = [];
  doctors: Doctor[] = [];
  availableTimes: string[] = [];

  isLoading = false;
  isSaving = false;

  errorMessage = '';
  successMessage = '';

  minimumDate = new Date();

  constructor(
    private fb: FormBuilder,
    private api: Apiservice,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();

    this.watchDoctorSelection();
  }

  createForm(): void {
    this.appointmentForm = this.fb.group({
      patientId: [
        '',
        Validators.required
      ],

      doctorId: [
        '',
        Validators.required
      ],

      date: [
        '',
        Validators.required
      ],

      time: [
        '',
        Validators.required
      ],

      reason: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ]
    });
  }

  loadPatients(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.api.getAllPatients().subscribe({
      next: (data: Patient[]) => {
        this.patients = data;
        this.isLoading = false;
        this.cd.detectChanges();
      },

      error: (error) => {
        console.error(
          'Patient loading error:',
          error
        );

        this.errorMessage =
          error.error?.message ||
          error.error?.error ||
          'Unable to load patients';

        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  loadDoctors(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.api.getAllDoctors().subscribe({
      next: (data: Doctor[]) => {
        this.doctors = data.filter(
          (doctor: Doctor) =>
            doctor.isActive !== false
        );

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
          error.error?.error ||
          'Unable to load doctors';

        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  watchDoctorSelection(): void {
    this.appointmentForm
      .get('doctorId')
      ?.valueChanges
      .subscribe((doctorId: string) => {
        this.updateAvailableTimes(
          doctorId
        );
      });
  }

  updateAvailableTimes(
    doctorId: string
  ): void {
    const selectedDoctor =
      this.doctors.find(
        (doctor: Doctor) =>
          doctor._id === doctorId
      );

    this.availableTimes =
      selectedDoctor?.availability || [];

    this.appointmentForm
      .get('time')
      ?.reset();
  }

  createAppointment(): void {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    const formValue =
      this.appointmentForm.getRawValue();

    const appointmentData = {
      patientId: formValue.patientId,
      doctorId: formValue.doctorId,

      date: this.formatDate(
        formValue.date
      ),

      time: formValue.time,

      reason: formValue.reason.trim()
    };

    console.log(
      'Appointment data:',
      appointmentData
    );

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.api
      .bookAppointment(
        appointmentData
      )
      .subscribe({
        next: () => {
          this.isSaving = false;

          this.successMessage =
            'Appointment created successfully';

          this.cd.detectChanges();

          setTimeout(() => {
            this.router.navigate([
              '/admin-appointments'
            ]);
          }, 1000);
        },

        error: (error) => {
          console.error(
            'Create appointment error:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            error.error?.error ||
            'Unable to create appointment';

          this.isSaving = false;
          this.cd.detectChanges();
        }
      });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  cancel(): void {
    this.router.navigate([
      '/admin-dashboard'
    ]);
  }

  hasError(
    controlName: string,
    errorName: string
  ): boolean {
    const control =
      this.appointmentForm.get(
        controlName
      );

    return Boolean(
      control?.touched &&
      control.hasError(errorName)
    );
  }

}
