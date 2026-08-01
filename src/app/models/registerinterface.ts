import { User } from "./user";

export interface RegisterData {
    name: string;

  email: string;

  password: string;

  role: 'admin' | 'patient' | 'doctor';

  age?: number;

  gender?: string;

  phone?: string;

  medicalHistory?: string;

  specialization?: string;

  availability?: string[];

}
