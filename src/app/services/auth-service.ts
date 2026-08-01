import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  saveToken(token:string){
    localStorage.setItem('token', token);
  }

  getToken(): string | null{
    return localStorage.getItem('token');
  }

  logout(){
    localStorage.removeItem('token');

  localStorage.removeItem('user');
  }

   getUser(): any {

    const user = localStorage.getItem('user');

    return user ? JSON.parse(user) : null;

  }
   saveUser(user: any) {

    localStorage.setItem(
      'user',
      JSON.stringify(user)
    );

  }
}
