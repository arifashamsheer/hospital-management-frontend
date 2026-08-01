export interface User {

   _id?: string;

  name: string;

  email: string;

password: string;

  role: 'admin' | 'patient' | 'doctor';

  token?: string;

  createdAt?: string;

  updatedAt?: string;

}