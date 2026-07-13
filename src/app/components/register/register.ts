import { ChangeDetectorRef, Component } from '@angular/core';
import { Apiservice } from '../../services/apiservice';
import { User } from '../../models/user';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  user:User={
    name:'',
    email:'',
    password:'',
    role:'patient'
  };

  constructor(private apiService:Apiservice,private cd: ChangeDetectorRef)
      {
    
      }

      register()
      {
    this.apiService.registerApi(this.user).subscribe(result=>{
      this.user=result;
       this.cd.detectChanges();
      });
      }

}
