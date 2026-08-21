import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  BaseChartDirective
} from 'ng2-charts';


import { MaterialModule } from '../material.module';

import {
  AdminRoutingModule
} from './admin-routing-module';


// ================================
// ADMIN COMPONENTS
// ================================

import {
  AdminDashboard
} from '../components/admin-dashboard/admin-dashboard';

import {
  AdminPatients
} from '../components/admin-patients/admin-patients';

import {
  AdminPatientDetails
} from '../components/admin-patient-details/admin-patient-details';

import {
  AddPatient
} from '../components/add-patient/add-patient';

import {
  EditPatient
} from '../components/edit-patient/edit-patient';

import {
  AdminDoctors
} from '../components/admin-doctors/admin-doctors';

import {
  AdminDoctorDetails
} from '../components/admin-doctor-details/admin-doctor-details';



import {
  EditDoctor
} from '../components/edit-doctor/edit-doctor';

import {
  AdminAppointments
} from '../components/admin-appointments/admin-appointments';

import {
  AdminAppointmentDetails
} from '../components/admin-appointment-details/admin-appointment-details';

import {
  AddAppointment
} from '../components/add-appointment/add-appointment';

import {
  AdminPayments
} from '../components/admin-payments/admin-payments';
import { RegisterDoctor } from '../components/register-doctor/register-doctor';


@NgModule({

  declarations: [

    AdminDashboard,

    AdminPatients,
    AdminPatientDetails,
    AddPatient,
    EditPatient,

    AdminDoctors,
    AdminDoctorDetails,
    RegisterDoctor,
    EditDoctor,

    AdminAppointments,
    AdminAppointmentDetails,
    AddAppointment,

    AdminPayments

  ],

  imports: [

    CommonModule,

    FormsModule,
    ReactiveFormsModule,

    MaterialModule,
    BaseChartDirective,

    AdminRoutingModule

  ]

})
export class AdminModule {}