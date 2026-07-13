import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-dashboard',
  standalone: false,
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.css',
})
export class PatientDashboard {
constructor(private router: Router){}


goToProfile(){

this.router.navigate(['/patient-profile']);

}


bookAppointment(){

this.router.navigate(['/book-appointment']);

}


viewAppointments(){

this.router.navigate(['/my-appointments']);

}

}
