import { NgModule } from '@angular/core';

import {
  RouterModule,
  Routes
} from '@angular/router';

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

import {
  authGuard
} from '../guards/auth-guard';

import {
  roleGuard
} from '../guards/role-guard';


const routes: Routes = [

  {
    path: 'doctor-dashboard',
    component: DoctorDashboard,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['doctor']
    }
  },

  {
    path: 'doctor-profile',
    component: DoctorProfile,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['doctor']
    }
  },

  {
    path: 'edit-doctor-profile',
    component: EditDoctorProfile,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['doctor']
    }
  },

  {
    path: 'doctor-appointments',
    component: DoctorAppointments,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['doctor']
    }
  }

];


@NgModule({

  imports: [
    RouterModule.forChild(routes)
  ],

  exports: [
    RouterModule
  ]

})
export class DoctorRoutingModule {}