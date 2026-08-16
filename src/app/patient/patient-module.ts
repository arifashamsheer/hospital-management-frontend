import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { MaterialModule } from '../material.module';

import { PatientRoutingModule } from './patient-routing-module';

import { PatientDashboard } from '../components/patient-dashboard/patient-dashboard';
import { PatientProfile } from '../components/patient-profile/patient-profile';
import { PatientEditProfile } from '../components/patient-edit-profile/patient-edit-profile';
import { BookAppointment } from '../components/book-appointment/book-appointment';
import { MyAppointments } from '../components/my-appointments/my-appointments';
import { PaymentStr } from '../components/payment-str/payment-str';
import { PaymentSuccess } from '../components/payment-success/payment-success';
import { MyPayments } from '../components/my-payments/my-payments';

@NgModule({
  declarations: [
    PatientDashboard,
    PatientProfile,
    PatientEditProfile,
    BookAppointment,
    MyAppointments,
    PaymentStr,
    PaymentSuccess,
    MyPayments
  ],

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PatientRoutingModule
  ]
})
export class PatientModule {}
