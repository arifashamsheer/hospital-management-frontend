import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { MaterialModule } from '../material.module';

import {
  DoctorRoutingModule
} from './doctor-routing-module';

import {
  DoctorDashboard
} from '../components/doctor-dashboard/doctor-dashboard';

import {
  DoctorAppointments
} from '../components/doctor-appointments/doctor-appointments';

import {
  DoctorProfile
} from '../components/doctor-profile/doctor-profile';

import {
  EditDoctorProfile
} from '../components/edit-doctor-profile/edit-doctor-profile';


@NgModule({

  declarations: [
    DoctorDashboard,
    DoctorAppointments,
    DoctorProfile,
    EditDoctorProfile
  ],

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DoctorRoutingModule
  ]

})
export class DoctorModule {}