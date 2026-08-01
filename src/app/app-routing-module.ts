import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Patients } from './components/patients/patients';
import { Doctors } from './components/doctors/doctors';
import { Appointments } from './components/appointments/appointments';
import { Register } from './components/register/register';
import { LoginComponents } from './components/login/login';
import { PatientDashboard } from './components/patient-dashboard/patient-dashboard';
import { PatientProfile } from './components/patient-profile/patient-profile';
import { BookAppointment } from './components/book-appointment/book-appointment';
import { MyAppointments } from './components/my-appointments/my-appointments';
import { DoctorDashboard } from './components/doctor-dashboard/doctor-dashboard';
import { DoctorAppointments } from './components/doctor-appointments/doctor-appointments';
import { DoctorProfile } from './components/doctor-profile/doctor-profile';
import { EditDoctorProfile } from './components/edit-doctor-profile/edit-doctor-profile';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { AdminDoctors } from './components/admin-doctors/admin-doctors';
import { AdminPatients } from './components/admin-patients/admin-patients';
import { AdminPatientDetails } from './components/admin-patient-details/admin-patient-details';
import { AdminAppointments } from './components/admin-appointments/admin-appointments';
import { RegisterDoctor } from './components/register-doctor/register-doctor';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';
import { AccessDenied } from './components/access-denied/access-denied';
import { PatientEditProfile } from './components/patient-edit-profile/patient-edit-profile';
import { MainLayout } from './components/main-layout/main-layout';
import { AddPatient } from './components/add-patient/add-patient';
import { AddAppointment } from './components/add-appointment/add-appointment';
import { EditPatient } from './components/edit-patient/edit-patient';
import { AdminDoctorDetails } from './components/admin-doctor-details/admin-doctor-details';
import { EditDoctor } from './components/edit-doctor/edit-doctor';
import { AdminAppointmentDetails } from './components/admin-appointment-details/admin-appointment-details';
import { PaymentStr } from './components/payment-str/payment-str';
import { PaymentSuccess } from './components/payment-success/payment-success';
import { MyPayments } from './components/my-payments/my-payments';
import { AdminPayments } from './components/admin-payments/admin-payments';

// const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'full' },

//   { path: 'patients', component: Patients },

//   { path: 'doctors', component: Doctors },

//   { path: 'appointments', component: Appointments },

//   { path:'register', component: Register },
  
//   { path:'login', component: LoginComponents },

//   { path:'patient-dashboard', component:PatientDashboard,
//   canActivate: [authGuard, roleGuard],
//   data: {
//     roles: ['patient']
//   } },

//   { path:'patient-profile',component:PatientProfile,
//   canActivate: [authGuard, roleGuard],
//   data: {
//     roles: ['patient']
//   } },

//   { path: 'book-appointment',component: BookAppointment,
//   canActivate: [authGuard, roleGuard],
//   data: {
//     roles: ['patient']
//   } },

//   {path:'my-appointments',
//  component:MyAppointments,
//   canActivate: [authGuard, roleGuard],
//   data: {
//     roles: ['patient']
//   }},
//  {
//  path:'doctor-dashboard',
//  component:DoctorDashboard,
//   canActivate: [authGuard, roleGuard],
//   data: {
//     roles: ['doctor']
//   }
// },
// {
//   path:'doctor-appointments',
//   component:DoctorAppointments,
//   canActivate: [authGuard, roleGuard],
//   data: {
//     roles: ['doctor']
//   }
// },
// {
//   path: 'doctor-profile',
//   component: DoctorProfile,
//   canActivate: [authGuard, roleGuard],
//   data: {
//     roles: ['doctor']
//   }
// },
// {
//   path: 'edit-doctor-profile',
//   component: EditDoctorProfile,
//   canActivate: [authGuard, roleGuard],
//   data: {
//     roles: ['doctor']
//   }
// },
// {
//   path: 'admin-dashboard',
//   component: AdminDashboard,
//   canActivate: [authGuard, roleGuard],
//   data: 
//   {
//     roles: ['admin']
//   }
// },
// {
//  path:'admin-doctors',
//  component:AdminDoctors,
//  canActivate: [authGuard, roleGuard],
//   data: {
//     roles: ['admin']
//   }

// },
// {
//   path: 'admin-patients',
//   component: AdminPatients,
//   canActivate: [authGuard, roleGuard],
//   data: {
//     roles: ['admin']
//   }
// },
// {
//  path:'admin-patient-details/:id',
//  component:AdminPatientDetails,
//  canActivate: [authGuard, roleGuard],
//   data: {
//     roles: ['admin']
//   }
// },
// {
//   path: 'admin-appointments',
//   component: AdminAppointments,
//   canActivate: [authGuard, roleGuard],
//   data: {
//     roles: ['admin']
//   }
// },
// {
//  path:'register-doctor',
//  component:RegisterDoctor,
//  canActivate: [authGuard, roleGuard],
//   data: {
//     roles: ['admin']
//   }
// },
// {
//   path: 'access-denied',
//   component: AccessDenied
// },
// {
//   path: 'patient-edit-profile',
//   component: PatientEditProfile,
//   canActivate: [authGuard, roleGuard],
//   data: {
//     roles: ['patient']
//   }
// },
//   { path: '**', redirectTo: 'login' }
// ];
const routes: Routes = [

  {
    path: '',
    component: MainLayout,
    children: [

      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },

      {
        path: 'patient-dashboard',
        component: PatientDashboard,
        canActivate: [authGuard, roleGuard],
        data: {
          roles: ['patient']
        }
      },

      {
        path: 'patient-profile',
        component: PatientProfile,
        canActivate: [authGuard, roleGuard],
        data: {
          roles: ['patient']
        }
      },
      {
  path: 'patient-edit-profile',
  component: PatientEditProfile,
  canActivate: [authGuard, roleGuard],
  data: {
    roles: ['patient']
  }
},

      {
        path: 'book-appointment',
        component: BookAppointment,
        canActivate: [authGuard, roleGuard],
        data: {
          roles: ['patient']
        }
      },

      {
        path: 'my-appointments',
        component: MyAppointments,
        canActivate: [authGuard, roleGuard],
        data: {
          roles: ['patient']
        }
      },

      {
        path: 'doctor-dashboard',
        component: DoctorDashboard,
        canActivate: [authGuard, roleGuard],
        data: {
          roles: ['doctor']
        }
      },

      {
        path: 'doctor-profile',
        component: DoctorProfile,
        canActivate: [authGuard, roleGuard],
        data: {
          roles: ['doctor']
        }
      },

      {
        path: 'edit-doctor-profile',
        component: EditDoctorProfile,
        canActivate: [authGuard, roleGuard],
        data: {
          roles: ['doctor']
        }
      },

      {
        path: 'doctor-appointments',
        component: DoctorAppointments,
        canActivate: [authGuard, roleGuard],
        data: {
          roles: ['doctor']
        }
      },

      {
        path: 'admin-dashboard',
        component: AdminDashboard,
        canActivate: [authGuard, roleGuard],
        data: {
          roles: ['admin']
        }
      },

      {
        path: 'admin-doctors',
        component: AdminDoctors,
        canActivate: [authGuard, roleGuard],
        data: {
          roles: ['admin']
        }
      },

      {
        path: 'admin-patients',
        component: AdminPatients,
        canActivate: [authGuard, roleGuard],
        data: {
          roles: ['admin']
        }
      },
      {
  path: 'admin-patient-details/:id',
  component: AdminPatientDetails,
  canActivate: [authGuard, roleGuard],
  data: {
    roles: ['admin']
  }
},
{
  path: 'edit-patient/:id',
  component: EditPatient,
  canActivate: [authGuard, roleGuard],
  data: {
    roles: ['admin']
  }
},

      {
        path: 'admin-appointments',
        component: AdminAppointments,
        canActivate: [authGuard, roleGuard],
        data: {
          roles: ['admin']
        }
      },
      {
  path: 'admin-doctor-details/:id',
  component: AdminDoctorDetails,
  canActivate: [authGuard, roleGuard],
  data: {
    roles: ['admin']
  }
},

      {
  path: 'add-patient',
  component: AddPatient,
  canActivate: [authGuard, roleGuard],
  data: {
    roles: ['admin']
  }
},

{
  path: 'add-appointment',
  component: AddAppointment,
  canActivate: [authGuard, roleGuard],
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
  path: 'payment/:appointmentId',
  component: PaymentStr,
  canActivate: [ authGuard,roleGuard ],
  data: {
    roles: ['patient']
  }
},
{
  path: 'payment-success',
  component: PaymentSuccess,
  canActivate: [ authGuard, roleGuard ],
  data: {
    roles: ['patient']
  }
},
{
  path: 'my-payments',
  component: MyPayments,
  canActivate: [authGuard, roleGuard],
  data: {
    roles: ['patient']
  }
},
{
  path: 'admin-payments',
  component: AdminPayments,
  canActivate: [authGuard, roleGuard],
  data: {
    roles: ['admin']
  }
},
{
  path: 'edit-doctor/:id',
  component: EditDoctor,
  canActivate: [authGuard, roleGuard],
  data: {
    roles: ['admin']
  }
},

      {
        path: 'register-doctor',
        component: RegisterDoctor,
        canActivate: [authGuard, roleGuard],
        data: {
          roles: ['admin']
        }
      }

    ]
  },

  {
    path: 'login',
    component: LoginComponents
  },

  {
    path: 'register',
    component: Register
  },
  {
    path: 'access-denied',
    component: AccessDenied
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
