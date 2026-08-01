import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreatePaymentIntentResponse {
  message: string;
  clientSecret: string;
  paymentId: string;
  amount: number;
  currency: string;
  appointmentId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  private readonly apiUrl =
    `${environment.apiUrl}/payments`;

  constructor(
    private http: HttpClient
  ) {}

  createPaymentIntent(
    appointmentId: string
  ): Observable<CreatePaymentIntentResponse> {
    return this.http.post<CreatePaymentIntentResponse>(
      `${this.apiUrl}/create-payment-intent`,
      {
        appointmentId
      }
    );
  }

  getMyPayments(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/my`
    );
  }

  getPaymentByAppointment(
    appointmentId: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/appointment/${appointmentId}`
    );
  }
  getAllPayments(): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.apiUrl}`
  );
}
  
}
