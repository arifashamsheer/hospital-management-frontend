import {
  NgModule,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { BaseChartDirective } from 'ng2-charts';

import { AppRoutingModule } from './app-routing-module';
import { MaterialModule } from './material.module';

import { App } from './app';

import { Register } from './components/register/register';
import { LoginComponents } from './components/login/login';
//import { PatientDashboard } from './components/patient-dashboard/patient-dashboard';
//import { PatientProfile } from './components/patient-profile/patient-profile';
//import { BookAppointment } from './components/book-appointment/book-appointment';
//import { MyAppointments } from './components/my-appointments/my-appointments';

import { DoctorDashboard } from './components/doctor-dashboard/doctor-dashboard';
import { DoctorAppointments } from './components/doctor-appointments/doctor-appointments';
import { DoctorProfile } from './components/doctor-profile/doctor-profile';
import { EditDoctorProfile } from './components/edit-doctor-profile/edit-doctor-profile';

import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { AdminDoctors } from './components/admin-doctors/admin-doctors';
import { AdminPatients } from './components/admin-patients/admin-patients';
import { AdminPatientDetails } from './components/admin-patient-details/admin-patient-details';
import { AdminAppointments } from './components/admin-appointments/admin-appointments';
import { AdminDoctorDetails } from './components/admin-doctor-details/admin-doctor-details';
import { AdminAppointmentDetails } from './components/admin-appointment-details/admin-appointment-details';
import { AdminPayments } from './components/admin-payments/admin-payments';

import { Appointments } from './components/appointments/appointments';
import { RegisterDoctor } from './components/register-doctor/register-doctor';
import { AccessDenied } from './components/access-denied/access-denied';
//import { PatientEditProfile } from './components/patient-edit-profile/patient-edit-profile';

import { MainLayout } from './components/main-layout/main-layout';
import { AddPatient } from './components/add-patient/add-patient';
import { AddAppointment } from './components/add-appointment/add-appointment';
import { EditPatient } from './components/edit-patient/edit-patient';
import { EditDoctor } from './components/edit-doctor/edit-doctor';

//import { PaymentStr } from './components/payment-str/payment-str';
//import { PaymentSuccess } from './components/payment-success/payment-success';
//import { MyPayments } from './components/my-payments/my-payments';



import { authInterceptor } from './interceptors/auth-interceptor';
import { Home } from './components/home/home';
import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog';

@NgModule({
  declarations: [
    App,
    Register,
    Appointments,
    LoginComponents,







    DoctorDashboard,
    DoctorAppointments,
    DoctorProfile,
    EditDoctorProfile,

    AdminDashboard,
    AdminDoctors,
    AdminPatients,
    AdminPatientDetails,
    AdminAppointments,
    AdminDoctorDetails,
    AdminAppointmentDetails,
    AdminPayments,

    RegisterDoctor,
    AccessDenied,
    MainLayout,

    AddPatient,
    AddAppointment,
    EditPatient,
    EditDoctor,



    Home,
    ConfirmDialog
  ],

  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    // Required for baseChart in non-standalone components
    BaseChartDirective
  ],

  providers: [
    provideBrowserGlobalErrorListeners(),

    provideHttpClient(
      withInterceptors([
        authInterceptor
      ])
    )
  ],

  bootstrap: [
    App
  ]
})
export class AppModule { }