import { NgModule } from '@angular/core';

import {
  RouterModule,
  Routes
} from '@angular/router';


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


// ================================
// GUARDS
// ================================

import {
  authGuard
} from '../guards/auth-guard';

import {
  roleGuard
} from '../guards/role-guard';
import { RegisterDoctor } from '../components/register-doctor/register-doctor';


const routes: Routes = [

  // ==============================
  // ADMIN DASHBOARD
  // ==============================

  {
    path: 'admin-dashboard',
    component: AdminDashboard,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['admin']
    }
  },


  // ==============================
  // PATIENT MANAGEMENT
  // ==============================

  {
    path: 'admin-patients',
    component: AdminPatients,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['admin']
    }
  },

  {
    path: 'admin-patient-details/:id',
    component: AdminPatientDetails,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['admin']
    }
  },

  {
    path: 'add-patient',
    component: AddPatient,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['admin']
    }
  },

  {
    path: 'edit-patient/:id',
    component: EditPatient,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['admin']
    }
  },


  // ==============================
  // DOCTOR MANAGEMENT
  // ==============================

  {
    path: 'admin-doctors',
    component: AdminDoctors,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['admin']
    }
  },

  {
    path: 'admin-doctor-details/:id',
    component: AdminDoctorDetails,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['admin']
    }
  },

  {
    path: 'register-doctor',
    component: RegisterDoctor,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['admin']
    }
  },

  {
    path: 'edit-doctor/:id',
    component: EditDoctor,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['admin']
    }
  },


  // ==============================
  // APPOINTMENT MANAGEMENT
  // ==============================

  {
    path: 'admin-appointments',
    component: AdminAppointments,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['admin']
    }
  },

  {
    path: 'admin-appointment-details/:id',
    component: AdminAppointmentDetails,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['admin']
    }
  },

  {
    path: 'add-appointment',
    component: AddAppointment,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['admin']
    }
  },


  // ==============================
  // PAYMENT MANAGEMENT
  // ==============================

  {
    path: 'admin-payments',
    component: AdminPayments,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['admin']
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
export class AdminRoutingModule {}
