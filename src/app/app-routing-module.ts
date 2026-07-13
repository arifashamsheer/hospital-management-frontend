import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Patients } from './components/patients/patients';
import { Doctors } from './components/doctors/doctors';
import { Appointments } from './components/appointments/appointments';
import { Register } from './components/register/register';
import { LoginComponents } from './components/login/login';
import { PatientDashboard } from './components/patient-dashboard/patient-dashboard';
import { PatientProfile } from './components/patient-profile/patient-profile';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'patients', component: Patients },

  { path: 'doctors', component: Doctors },

  { path: 'appointments', component: Appointments },

  { path:'register', component: Register },
  
  { path:'login', component: LoginComponents },

  { path:'patient-dashboard', component:PatientDashboard },
  
  { path:'patient-profile',component:PatientProfile },

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
