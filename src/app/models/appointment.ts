import { Doctor } from "./doctor";
import { Patient } from "./patient";

export interface Appointment {
    _id?: string;
 patientId: Patient;   
  doctorId: Doctor;   
  date: string;
  time: string;
  status?: string;
  reason?: string;
  createdAt?: string;
  updatedAt?: string;
}
