export interface Doctor {

  _id?: string;

  userId?: string;

  name: string;

  specialization?: string;

  phone?: string;

  email?: string;

  availability?: string[];

  isActive?: boolean;

  createdAt?: string;
   role?: string;

  updatedAt?: string;

}