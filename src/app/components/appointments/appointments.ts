import { ChangeDetectorRef, Component } from '@angular/core';
import { Apiservice } from '../../services/apiservice';
import { Appointment } from '../../models/appointment';

@Component({
  selector: 'app-appointments',
  standalone: false,
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export class Appointments {

  appointments:Appointment[]=[];
  
 constructor(private apiService:Apiservice,private cd: ChangeDetectorRef)
    {
  
    }
    ngOnInit(): void {
      this.loadAppointments();
    }
    loadAppointments()
    {
      this.apiService.getAppointments().subscribe(result=>{

      this.appointments=result;
       this.cd.detectChanges();
      });
    }
}
