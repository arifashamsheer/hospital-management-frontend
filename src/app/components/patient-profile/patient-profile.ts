import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Patient } from '../../models/patient';
import { Apiservice } from '../../services/apiservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-profile',
  standalone: false,
  templateUrl: './patient-profile.html',
  styleUrl: './patient-profile.css',
})
export class PatientProfile implements OnInit{
  patient!: Patient;


  constructor(
    private apiService: Apiservice, private router: Router,
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
  editProfile(): void {

    this.router.navigate([
      '/patient-edit-profile'
    ]);

  }

}
