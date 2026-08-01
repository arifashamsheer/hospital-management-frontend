import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-patient-dashboard',
  standalone: false,
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.css',
})
export class PatientDashboard {
constructor(private router:Router,
private authService:AuthService){}


goToProfile(){

this.router.navigate(['/patient-profile']);

}


bookAppointment(){

this.router.navigate(['/book-appointment']);

}


viewAppointments(){

this.router.navigate(['/my-appointments']);

}
logout(){

this.authService.logout();

this.router.navigate(['/login']);

}

}
