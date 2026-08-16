import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';

import { PatientDashboard } from '../components/patient-dashboard/patient-dashboard';
import { PatientProfile } from '../components/patient-profile/patient-profile';
import { PatientEditProfile } from '../components/patient-edit-profile/patient-edit-profile';
import { BookAppointment } from '../components/book-appointment/book-appointment';
import { MyAppointments } from '../components/my-appointments/my-appointments';
import { PaymentStr } from '../components/payment-str/payment-str';
import { PaymentSuccess } from '../components/payment-success/payment-success';
import { MyPayments } from '../components/my-payments/my-payments';

import { authGuard } from '../guards/auth-guard';
import { roleGuard } from '../guards/role-guard';


const routes: Routes = [

  {
    path: 'patient-dashboard',
    component: PatientDashboard,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['patient']
    }
  },

  {
    path: 'patient-profile',
    component: PatientProfile,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['patient']
    }
  },

  {
    path: 'patient-edit-profile',
    component: PatientEditProfile,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['patient']
    }
  },

  {
    path: 'book-appointment',
    component: BookAppointment,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['patient']
    }
  },

  {
    path: 'my-appointments',
    component: MyAppointments,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['patient']
    }
  },

  {
    path: 'payment/:appointmentId',
    component: PaymentStr,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['patient']
    }
  },

  {
    path: 'payment-success',
    component: PaymentSuccess,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['patient']
    }
  },

  {
    path: 'my-payments',
    component: MyPayments,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['patient']
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
export class PatientRoutingModule {}