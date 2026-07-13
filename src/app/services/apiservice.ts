import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient';
import { Doctor } from '../models/doctor';
import { Appointment } from '../models/appointment';
import { User } from '../models/user';
import { Authresponse } from '../models/authresponse';
import { Login } from '../models/login';


@Injectable({
  providedIn: 'root',
})
export class Apiservice {
  baseUrl = 'http://localhost:3000/api'
  constructor(private http: HttpClient) {

  }
  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}/patients`)
  }
  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.baseUrl}/doctors`)
  }
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/appointments`)
  }

  registerApi(userData:User): Observable<User>{
    return this.http.post<User>(`${this.baseUrl}/auth/register`,userData)
    
  }
  loginApi(user:Login){
    return this.http.post<Authresponse>(`${this.baseUrl}/auth/login`,user)
  }
  getMyProfile(){
    return this.http.get<Patient>(`${this.baseUrl}/patients/me`);
  }
}
