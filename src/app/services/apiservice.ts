import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient';
import { Doctor } from '../models/doctor';
import { Appointment } from '../models/appointment';
import { User } from '../models/user';
import { Authresponse } from '../models/authresponse';
import { Login } from '../models/login';
import { AuthService } from './auth-service';
import { RegisterData } from '../models/registerinterface';
import { AppointmentRequest } from '../models/appointment-request';



@Injectable({
  providedIn: 'root',
})
export class Apiservice {

baseUrl = 'http://localhost:3000/api';


constructor(
 private http:HttpClient,
 private authService:AuthService
){}

//patient
getPatients():Observable<Patient[]>{

return this.http.get<Patient[]>(
`${this.baseUrl}/patients`
);

}

addPatient(
  patientData: Partial<Patient>
): Observable<Patient> {
  return this.http.post<Patient>(
    `${this.baseUrl}/patients`,
    patientData
  );
}


//doctor
getDoctors():Observable<Doctor[]>{
  
return this.http.get<Doctor[]>(
`${this.baseUrl}/doctors`
);

}


//appointment
getAppointments(): Observable<Appointment[]> {
  return this.http.get<Appointment[]>(
    `${this.baseUrl}/appointments`
  );
}



//auth
registerApi(data:RegisterData){

return this.http.post<any>(
`${this.baseUrl}/auth/register`,
data
);

}



loginApi(user:Login){

return this.http.post<Authresponse>(
`${this.baseUrl}/auth/login`,
user
);

}



//patient
getMyProfile():Observable<Patient>{





return this.http.get<Patient>(
`${this.baseUrl}/patients/me`,


);


}
//appointment
bookAppointment(
  data: AppointmentRequest
): Observable<Appointment> {
  return this.http.post<Appointment>(
    `${this.baseUrl}/appointments`,
    data
  );
}
//appointment
getMyAppointments(){



return this.http.get<Appointment[]>(
 `${this.baseUrl}/appointments`,
 
);
}
//appointmnet
updateAppointment(id:string,data:any){




return this.http.put(
`${this.baseUrl}/appointments/${id}`,
data,

);


}
//appointment
updateAppointmentStatus(
  id: string,
  status: string
): Observable<Appointment> {
  return this.http.patch<Appointment>(
    `${this.baseUrl}/appointments/${id}/status`,
    { status }
  );
}
//doctor
getDoctorProfile() {

 

  return this.http.get<Doctor>(
    `${this.baseUrl}/doctors/me`
    
  );

}
updateDoctorProfile(
  doctorData: Partial<Doctor>
): Observable<Doctor> {
  return this.http.put<Doctor>(
    `${this.baseUrl}/doctors/me`,
    doctorData
  );
}
//doctor
updateDoctor(
  id: string,
  doctorData: Partial<Doctor>
): Observable<Doctor> {
  return this.http.put<Doctor>(
    `${this.baseUrl}/doctors/${id}`,
    doctorData
  );
}
//doctor

getAllDoctors(): Observable<Doctor[]> {
  return this.http.get<Doctor[]>(
    `${this.baseUrl}/doctors`
  );
}
//doctor
deleteDoctor(id:string){

 


 return this.http.delete(
 `${this.baseUrl}/doctors/${id}`,
 
 );

}
//patient
getAllPatients(): Observable<Patient[]> {
  return this.http.get<Patient[]>(
    `${this.baseUrl}/patients`
  );
}
//patient
getPatientById(id:string){

 


 return this.http.get<Patient>(
 `${this.baseUrl}/patients/${id}`,
 
 );

}
//patient
getPatientAppointments(id:string){




return this.http.get<Appointment[]>(
`${this.baseUrl}/patients/${id}/appointments`,

);


}

getAdminStats(){

 return this.http.get<any>(
  `${this.baseUrl}/admin/stats`,
  {
    headers:this.getHeaders()
  }
 );

}
getHeaders(){

 const token=localStorage.getItem('token');

 return {
   Authorization:`Bearer ${token}`
 };

}
//doctor
updateDoctorStatus(
  id: string,
  isActive: boolean
) {
  return this.http.patch(
    `${this.baseUrl}/doctors/${id}/status`,
    { isActive }
  );
}

updateMyProfile(
  patientData: any
) {
  return this.http.put(
    `${this.baseUrl}/patients/me`,
    patientData
  );
}

cancelAppointment(id: string) {
  return this.http.delete(
    `${this.baseUrl}/appointments/${id}`
  );
}
updatePatient(
  id: string,
  data: any
) {
  return this.http.put(
    `${this.baseUrl}/patients/${id}`,
    data
  );
}
getDoctorById(
  id: string
): Observable<Doctor> {
  return this.http.get<Doctor>(
    `${this.baseUrl}/doctors/${id}`
  );
}
getAppointmentById(
  id: string
): Observable<Appointment> {
  return this.http.get<Appointment>(
    `${this.baseUrl}/appointments/${id}`
  );
}

}

