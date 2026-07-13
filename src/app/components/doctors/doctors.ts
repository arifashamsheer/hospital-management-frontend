import { ChangeDetectorRef, Component } from '@angular/core';
import { Doctor } from '../../models/doctor';
import { Apiservice } from '../../services/apiservice';

@Component({
  selector: 'app-doctors',
  standalone: false,
  templateUrl: './doctors.html',
  styleUrl: './doctors.css',
})
export class Doctors {
    doctors:Doctor[]=[];
  
    constructor(private apiService:Apiservice,private cd: ChangeDetectorRef)
    {
  
    }
    ngOnInit(): void {
      this.loadDoctors();
    }
    loadDoctors()
    {
      this.apiService.getDoctors().subscribe(result=>{
      this.doctors=result;
       this.cd.detectChanges();
      });
    }

}
