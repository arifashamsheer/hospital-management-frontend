import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-payment-success',
  standalone: false,
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.css',
})
export class PaymentSuccess implements OnInit {

  appointmentId = '';

  payment: any = null;

  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.appointmentId =
      this.route.snapshot.queryParamMap.get(
        'appointmentId'
      ) || '';

    if (!this.appointmentId) {
      this.errorMessage =
        'Appointment ID is missing';

      this.isLoading = false;
      return;
    }

    this.loadPayment();
  }

  loadPayment(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.paymentService
      .getPaymentByAppointment(
        this.appointmentId
      )
      .subscribe({
        next: (data) => {
          this.payment = data;
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
            'Unable to load payment details';

          this.isLoading = false;
          this.cd.detectChanges();
        }
      });
  }
downloadReceipt(): void {
  if (!this.payment) {
    return;
  }

  const doc = new jsPDF();

  const patientName =
    this.payment.patientId?.name || 'Patient';

  const doctorName =
    this.payment.doctorId?.name || 'Doctor';

  const appointmentDate =
    this.payment.appointmentId?.date
      ? new Date(
          this.payment.appointmentId.date
        ).toLocaleDateString('en-US')
      : '-';

  const appointmentTime =
    this.payment.appointmentId?.time || '-';

  const paidAt =
    this.payment.paidAt
      ? new Date(
          this.payment.paidAt
        ).toLocaleString('en-US')
      : '-';

  const currency =
    (
      this.payment.currency || 'AED'
    ).toUpperCase();

  const amount =
    Number(
      this.payment.amount || 0
    ).toFixed(2);

  // Header
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

  doc.setLineWidth(0.5);
  doc.line(20, 38, 190, 38);

  // Receipt details
  doc.setFontSize(11);

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
    'Receipt Number',
    this.payment._id || '-'
  );

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
    appointmentTime
  );

  addRow(
    'Amount Paid',
    `${currency} ${amount}`
  );

  addRow(
    'Payment Status',
    this.payment.paymentStatus || '-'
  );

  addRow(
    'Payment Method',
    this.payment.paymentMethod || 'Stripe'
  );

  addRow(
    'Transaction ID',
    this.payment.transactionId || '-'
  );

  addRow(
    'Paid At',
    paidAt
  );

  doc.line(20, y + 2, 190, y + 2);

  doc.setFontSize(10);

  doc.text(
    'Thank you for choosing our hospital.',
    105,
    y + 15,
    {
      align: 'center'
    }
  );

  doc.text(
    'This is a computer-generated receipt.',
    105,
    y + 22,
    {
      align: 'center'
    }
  );

  const receiptName =
    `payment-receipt-${this.appointmentId}.pdf`;

  doc.save(receiptName);
}
  goToAppointments(): void {
    this.router.navigate([
      '/my-appointments'
    ]);
  }

  goToDashboard(): void {
    this.router.navigate([
      '/patient-dashboard'
    ]);
  }

}
