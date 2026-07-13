import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Patient } from '../../models/patient';
import { Apiservice } from '../../services/apiservice';

@Component({
  selector: 'app-patients',
  standalone: false,
  templateUrl: './patients.html',
  styleUrl: './patients.css',
})
export class Patients implements OnInit{

  patients:Patient[]=[];

  constructor(private apiService:Apiservice,private cd: ChangeDetectorRef)
    {
  
    }
    ngOnInit(): void {
      this.loadPatients();
    }
    loadPatients()
    {
      this.apiService.getPatients().subscribe(result=>{
      this.patients=result;
       this.cd.detectChanges();
      });
    }


}
