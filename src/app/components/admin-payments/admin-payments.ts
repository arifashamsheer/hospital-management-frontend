import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentService } from '../../services/payment';

@Component({
  selector: 'app-admin-payments',
  standalone: false,
  templateUrl: './admin-payments.html',
  styleUrl: './admin-payments.css',
})
export class AdminPayments implements OnInit {

  displayedColumns: string[] = [
    'patient',
    'doctor',
    'appointment',
    'amount',
    'status',
    'paidAt',
    'transactionId'
  ];

  dataSource =
    new MatTableDataSource<any>([]);

  isLoading = true;
  errorMessage = '';

  totalRevenue = 0;
  paidCount = 0;
  pendingCount = 0;
  failedCount = 0;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private paymentService: PaymentService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.paymentService
      .getAllPayments()
      .subscribe({
        next: (payments: any[]) => {
          this.dataSource.data = payments;

          this.calculateStatistics(payments);

          this.isLoading = false;
          this.cd.detectChanges();

          setTimeout(() => {
            this.dataSource.paginator =
              this.paginator;
          });
        },

        error: (error) => {
          console.error(
            'Admin payment loading error:',
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

  calculateStatistics(
    payments: any[]
  ): void {
    this.totalRevenue = payments
      .filter(
        payment =>
          payment.paymentStatus === 'Paid'
      )
      .reduce(
        (total, payment) =>
          total + Number(payment.amount || 0),
        0
      );

    this.paidCount = payments.filter(
      payment =>
        payment.paymentStatus === 'Paid'
    ).length;

    this.pendingCount = payments.filter(
      payment =>
        payment.paymentStatus === 'Pending' ||
        payment.paymentStatus === 'Processing'
    ).length;

    this.failedCount = payments.filter(
      payment =>
        payment.paymentStatus === 'Failed' ||
        payment.paymentStatus === 'Cancelled'
    ).length;
  }

  applyFilter(
    event: Event
  ): void {
    const value =
      (event.target as HTMLInputElement)
        .value
        .trim()
        .toLowerCase();

    this.dataSource.filter = value;

    this.dataSource.paginator
      ?.firstPage();
  }

  getStatusClass(
    status: string
  ): string {
    return `status-${status.toLowerCase()}`;
  }

}
