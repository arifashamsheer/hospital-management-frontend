import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Patients } from './components/patients/patients';
import { Doctors } from './components/doctors/doctors';
import { Appointments } from './components/appointments/appointments';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'patients', component: Patients },

  { path: 'doctors', component: Doctors },

  { path: 'appointments', component: Appointments },

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
