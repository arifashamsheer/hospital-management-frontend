import { ChangeDetectorRef, Component } from '@angular/core';
import { Apiservice } from '../../services/apiservice';
import { Login } from '../../models/login'

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponents {

  user:Login = {
     email:'',
   password:''
  }

  constructor(private apiService:Apiservice,private cd: ChangeDetectorRef)
      {
    
      }

       loginhere()
      {
    this.apiService.loginApi(this.user).subscribe(result=>{
      localStorage.setItem(
      'token',
      result.token
    );


    localStorage.setItem(
      'user',
      JSON.stringify(result.user)
    );
    console.log(localStorage.getItem('token'));
  console.log(JSON.parse(localStorage.getItem('user')!));


    alert("Login Successful");
       this.cd.detectChanges();
      });
      }


}
