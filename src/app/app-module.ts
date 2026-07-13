import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Register } from './components/register/register';
import { LoginComponents } from './components/login/login';
import { PatientDashboard } from './components/patient-dashboard/patient-dashboard';
import { PatientProfile } from './components/patient-profile/patient-profile';

@NgModule({
  declarations: [
    App,
    Register,
    LoginComponents,
    PatientDashboard,
    PatientProfile
  ],
  imports: [
  BrowserModule,
  AppRoutingModule,
  FormsModule
],
providers: [
  provideBrowserGlobalErrorListeners(),
  provideHttpClient()
],
  bootstrap: [App]
})
export class AppModule { }