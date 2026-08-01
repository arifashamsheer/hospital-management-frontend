import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-my-payments',
  standalone: false,
  templateUrl: './my-payments.html',
  styleUrl: './my-payments.css',
})
export class MyPayments implements OnInit {

  payments: any[] = [];

  displayedColumns: string[] = [
    'doctor',
    'appointmentDate',
    'amount',
    'status',
    'paidAt',
    'actions'
  ];

  isLoading = true;
  errorMessage = '';

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.paymentService
      .getMyPayments()
      .subscribe({
        next: (data: any[]) => {
          this.payments = data;
          this.isLoading = false;
          this.cd.detectChanges();
        },

        error: (error) => {
          console.error(
            'Payment loading error:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            error.error?.error ||
            'Unable to load payments';

          this.isLoading = false;
          this.cd.detectChanges();
        }
      });
  }
  downloadReceipt(payment: any): void {
  const doc = new jsPDF();

  const patientName =
    payment.patientId?.name || 'Patient';

  const doctorName =
    payment.doctorId?.name || 'Doctor';

  const appointmentDate =
    payment.appointmentId?.date
      ? new Date(
          payment.appointmentId.date
        ).toLocaleDateString('en-US')
      : '-';

  const paidAt =
    payment.paidAt
      ? new Date(
          payment.paidAt
        ).toLocaleString('en-US')
      : '-';

  const currency =
    (
      payment.currency || 'AED'
    ).toUpperCase();

  const amount =
    Number(
      payment.amount || 0
    ).toFixed(2);

  doc.setFontSize(20);

  doc.text(
    'Hospital Management System',
    105,
    20,
    {
      align: 'center'
    }
  );

  doc.setFontSize(16);

  doc.text(
    'PAYMENT RECEIPT',
    105,
    32,
    {
      align: 'center'
    }
  );

  doc.line(20, 38, 190, 38);

  let y = 50;

  const addRow = (
    label: string,
    value: string
  ): void => {
    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.text(
      `${label}:`,
      25,
      y
    );

    doc.setFont(
      'helvetica',
      'normal'
    );

    doc.text(
      value,
      75,
      y
    );

    y += 10;
  };

  addRow(
    'Patient',
    patientName
  );

  addRow(
    'Doctor',
    `Dr. ${doctorName}`
  );

  addRow(
    'Appointment Date',
    appointmentDate
  );

  addRow(
    'Appointment Time',
    payment.appointmentId?.time || '-'
  );

  addRow(
    'Amount Paid',
    `${currency} ${amount}`
  );

  addRow(
    'Status',
    payment.paymentStatus || '-'
  );

  addRow(
    'Transaction ID',
    payment.transactionId || '-'
  );

  addRow(
    'Paid At',
    paidAt
  );

  doc.line(20, y + 2, 190, y + 2);

  doc.text(
    'Thank you for choosing our hospital.',
    105,
    y + 15,
    {
      align: 'center'
    }
  );

  doc.save(
    `payment-receipt-${payment._id}.pdf`
  );
}

  viewPayment(payment: any): void {
    this.router.navigate(
      ['/payment-success'],
      {
        queryParams: {
          appointmentId:
            payment.appointmentId?._id ||
            payment.appointmentId
        }
      }
    );
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

}
