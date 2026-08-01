import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import {
  ChartConfiguration,
  ChartData,
  ChartOptions
} from 'chart.js';

import { AuthService } from '../../services/auth-service';
import { Apiservice } from '../../services/apiservice';
import { PaymentService } from '../../services/payment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  stats = {
    patients: 0,
    doctors: 0,
    appointments: 0,
    pendingAppointments: 0
  };

  totalRevenue = 0;
  paidPayments = 0;
  pendingPayments = 0;
  failedPayments = 0;

  isLoading = false;
  errorMessage = '';

  // Exact literal type: fixes the HTML chart type error
  appointmentChartType: 'bar' = 'bar';

  appointmentChartData: ChartData<'bar'> = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],
    datasets: [
      {
        label: 'Appointments',
        data: [
          0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0
        ]
      }
    ]
  };

  appointmentChartOptions:
    ChartConfiguration<'bar'>['options'] = {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: true
        }
      },

      scales: {
        x: {
          grid: {
            display: false
          }
        },

        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    };

  // Exact literal type: fixes the HTML chart type error
  paymentChartType: 'doughnut' = 'doughnut';

  paymentChartData: ChartData<'doughnut'> = {
    labels: [
      'Paid',
      'Pending',
      'Processing',
      'Failed',
      'Cancelled'
    ],
    datasets: [
      {
        data: [
          0,
          0,
          0,
          0,
          0
        ]
      }
    ]
  };

  paymentChartOptions:
    ChartOptions<'doughnut'> = {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    };

  constructor(
    private router: Router,
    private authService: AuthService,
    private api: Apiservice,
    private paymentService: PaymentService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      stats: this.api.getAdminStats(),
      appointments: this.api.getAppointments(),
      payments: this.paymentService.getAllPayments()
    }).subscribe({
      next: ({
        stats,
        appointments,
        payments
      }) => {

        this.stats = {
          patients: stats?.patients ?? 0,
          doctors: stats?.doctors ?? 0,
          appointments: stats?.appointments ?? 0,
          pendingAppointments:
            stats?.pendingAppointments ?? 0
        };

        const appointmentList = Array.isArray(appointments)
          ? appointments
          : [];

        const paymentList = Array.isArray(payments)
          ? payments
          : [];

        this.prepareAppointmentChart(
          appointmentList
        );

        this.preparePaymentChart(
          paymentList
        );

        this.calculatePaymentStatistics(
          paymentList
        );

        this.isLoading = false;
        this.cd.detectChanges();

        console.log(
          'Admin dashboard data:',
          {
            stats,
            appointments,
            payments
          }
        );
      },

      error: (error) => {
        console.error(
          'Admin dashboard error:',
          error
        );

        this.errorMessage =
          error.error?.message ||
          error.error?.error ||
          'Unable to load dashboard information';

        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  prepareAppointmentChart(
    appointments: any[]
  ): void {

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];

    const monthlyTotals =
      new Array<number>(12).fill(0);

    const currentYear =
      new Date().getFullYear();

    appointments.forEach(
      appointment => {

        if (!appointment?.date) {
          return;
        }

        const rawDate =
          String(appointment.date);

        let date: Date;

        /*
         * Handles both:
         * 2026-07-29
         * 2026-07-29T00:00:00.000Z
         */
        if (rawDate.includes('T')) {
          date = new Date(rawDate);
        } else {
          date = new Date(
            `${rawDate}T00:00:00`
          );
        }

        if (
          Number.isNaN(
            date.getTime()
          )
        ) {
          return;
        }

        if (
          date.getFullYear() !==
          currentYear
        ) {
          return;
        }

        const monthIndex =
          date.getMonth();

        monthlyTotals[monthIndex]++;
      }
    );

    this.appointmentChartData = {
      labels: monthNames,
      datasets: [
        {
          label:
            `Appointments ${currentYear}`,
          data: monthlyTotals
        }
      ]
    };
  }

  preparePaymentChart(
    payments: any[]
  ): void {

    const countStatus = (
      status: string
    ): number => {

      return payments.filter(
        payment =>
          payment?.paymentStatus === status
      ).length;
    };

    this.paymentChartData = {
      labels: [
        'Paid',
        'Pending',
        'Processing',
        'Failed',
        'Cancelled'
      ],
      datasets: [
        {
          data: [
            countStatus('Paid'),
            countStatus('Pending'),
            countStatus('Processing'),
            countStatus('Failed'),
            countStatus('Cancelled')
          ]
        }
      ]
    };
  }

  calculatePaymentStatistics(
    payments: any[]
  ): void {

    const paid = payments.filter(
      payment =>
        payment?.paymentStatus === 'Paid'
    );

    this.totalRevenue = paid.reduce(
      (
        total: number,
        payment: any
      ) => {
        return (
          total +
          Number(payment?.amount || 0)
        );
      },
      0
    );

    this.paidPayments =
      paid.length;

    this.pendingPayments =
      payments.filter(
        payment =>
          payment?.paymentStatus ===
            'Pending' ||
          payment?.paymentStatus ===
            'Processing'
      ).length;

    this.failedPayments =
      payments.filter(
        payment =>
          payment?.paymentStatus ===
            'Failed' ||
          payment?.paymentStatus ===
            'Cancelled'
      ).length;
  }

  refreshDashboard(): void {
    this.loadDashboard();
  }

  goToDoctors(): void {
    this.router.navigate([
      '/admin-doctors'
    ]);
  }

  goToPatients(): void {
    this.router.navigate([
      '/admin-patients'
    ]);
  }

  goToAppointments(): void {
    this.router.navigate([
      '/admin-appointments'
    ]);
  }

  goToRegisterDoctor(): void {
    this.router.navigate([
      '/register-doctor'
    ]);
  }

  goToAddPatient(): void {
    this.router.navigate([
      '/add-patient'
    ]);
  }

  goToAddAppointment(): void {
    this.router.navigate([
      '/add-appointment'
    ]);
  }

  logout(): void {
    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);
  }
}