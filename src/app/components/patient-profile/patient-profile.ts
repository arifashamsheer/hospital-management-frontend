import { ChangeDetectorRef, Component } from '@angular/core';
import { Patient } from '../../models/patient';
import { Apiservice } from '../../services/apiservice';

@Component({
  selector: 'app-patient-profile',
  standalone: false,
  templateUrl: './patient-profile.html',
  styleUrl: './patient-profile.css',
})
export class PatientProfile {
  patient!: Patient;


  constructor(
    private apiService: Apiservice,
    private cd: ChangeDetectorRef
  ) { }



  ngOnInit() {

    this.loadProfile();

  }



  loadProfile() {

    this.apiService.getMyProfile().subscribe(result => {
      this.patient = result;
      this.cd.detectChanges();


    })





  }

}
