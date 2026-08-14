import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Stripe,
  StripeElements,
  StripePaymentElement,
  loadStripe
} from '@stripe/stripe-js';

import { PaymentService } from '../../services/payment';
import { Apiservice } from '../../services/apiservice';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-payment-str',
  standalone: false,
  templateUrl: './payment-str.html',
  styleUrl: './payment-str.css',
})
export class PaymentStr
  implements AfterViewInit, OnDestroy {

  appointmentId = '';

  amount = 0;
  currency = 'AED';

  appointment: any = null;
  existingPayment: any = null;

  isLoading = true;
  isPaying = false;

  canPay = false;
  alreadyPaid = false;

  errorMessage = '';
  successMessage = '';

  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;

  private paymentElement:
    StripePaymentElement | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private api: Apiservice,
    private cd: ChangeDetectorRef
  ) {}

  async ngAfterViewInit(): Promise<void> {

    this.appointmentId =
      this.route.snapshot.paramMap.get(
        'appointmentId'
      ) || '';

    if (!this.appointmentId) {
      this.errorMessage =
        'Appointment ID is missing';

      this.isLoading = false;
      this.cd.detectChanges();

      return;
    }

    this.checkAppointment();
  }

  /*
  |--------------------------------------------------------------------------
  | Check appointment status
  |--------------------------------------------------------------------------
  */

  private checkAppointment(): void {

    this.isLoading = true;
    this.errorMessage = '';
    this.canPay = false;
    this.alreadyPaid = false;

    this.api
      .getAppointmentById(
        this.appointmentId
      )
      .subscribe({

        next: (response: any) => {

          this.appointment =
            response.appointment ??
            response.data ??
            response;

          if (!this.appointment) {
            this.showError(
              'Appointment was not found.'
            );

            return;
          }

          if (
            this.appointment.status !==
            'Approved'
          ) {
            this.showError(
              'Payment is available only after the appointment is approved.'
            );

            return;
          }

          this.checkExistingPayment();
        },

        error: (error) => {

          console.error(
            'Appointment loading error:',
            error
          );

          this.showError(
            error.error?.message ||
            'Unable to load appointment information.'
          );
        }
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Check whether payment already exists
  |--------------------------------------------------------------------------
  */

  private checkExistingPayment(): void {

    this.paymentService
      .getPaymentByAppointment(
        this.appointmentId
      )
      .subscribe({

        next: (response: any) => {

          this.existingPayment =
            response.payment ??
            response.data ??
            response;

          const paymentStatus =
            this.existingPayment
              ?.paymentStatus;

          if (
            paymentStatus === 'Paid' ||
            paymentStatus === 'Processing'
          ) {
            this.alreadyPaid =
              paymentStatus === 'Paid';

            this.canPay = false;

            this.errorMessage =
              paymentStatus === 'Paid'
                ? 'This appointment has already been paid.'
                : 'The payment for this appointment is currently processing.';

            this.isLoading = false;
            this.cd.detectChanges();

            return;
          }

          this.initializeStripePayment();
        },

        error: (error) => {

          /*
            If your backend returns 404 when no payment
            exists, that means the appointment is unpaid.
          */

          if (
            error.status === 404
          ) {
            this.initializeStripePayment();
            return;
          }

          console.error(
            'Payment status check error:',
            error
          );

          this.showError(
            error.error?.message ||
            error.error?.error ||
            'Unable to check payment status.'
          );
        }
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Initialize Stripe
  |--------------------------------------------------------------------------
  */

  private async initializeStripePayment():
    Promise<void> {

    try {

      this.isLoading = true;
      this.errorMessage = '';

      this.stripe = await loadStripe(
        environment.stripePublishableKey
      );

      if (!this.stripe) {
        throw new Error(
          'Unable to load Stripe'
        );
      }

      this.paymentService
        .createPaymentIntent(
          this.appointmentId
        )
        .subscribe({

          next: (response) => {

  console.log(
    'Payment intent response:',
    response
  );

  this.amount =
    Number(response.amount || 0);

  this.currency =
    response.currency || 'AED';

  if (!response.clientSecret) {
    this.showError(
      'Payment client secret is missing.'
    );

    return;
  }

  if (this.amount <= 0) {
    this.showError(
      'The payment amount is invalid.'
    );

    return;
  }

  this.elements =
    this.stripe!.elements({

      clientSecret:
        response.clientSecret,

      appearance: {
        theme: 'stripe',

        variables: {
          borderRadius: '8px'
        }
      }
    });

  this.paymentElement =
    this.elements.create(
      'payment',
      {
        layout: 'tabs'
      }
    );

  /*
    First display the payment-content
    so #payment-element exists.
  */

  this.canPay = true;
  this.isLoading = false;

  this.cd.detectChanges();

  /*
    Mount after Angular creates the element.
  */

  setTimeout(() => {

  const container =
    document.getElementById('payment-element');

  if (!container) {
    console.error('Container not found');
    return;
  }

  // remove previous Stripe element
  container.innerHTML = '';

  this.paymentElement?.mount(container);

  console.log('Stripe mounted successfully');

}, 300);
          },

          error: (error) => {

            console.error(
              'Payment initialization error:',
              error
            );

            const message =
              error.error?.message ||
              error.error?.error ||
              'Unable to initialize payment';

            if (
              message
                .toLowerCase()
                .includes('already paid')
            ) {
              this.alreadyPaid = true;
            }

            this.showError(message);
          }
        });

    } catch (error: any) {

      console.error(
        'Stripe loading error:',
        error
      );

      this.showError(
        error.message ||
        'Unable to load Stripe'
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Submit payment
  |--------------------------------------------------------------------------
  */

  async payNow(): Promise<void> {

    if (!this.canPay) {
      return;
    }

    if (
      !this.stripe ||
      !this.elements
    ) {
      this.errorMessage =
        'Payment form is not ready';

      return;
    }

    this.isPaying = true;
    this.errorMessage = '';
    this.successMessage = '';

    const returnUrl =
      `${window.location.origin}` +
      `/payment-success` +
      `?appointmentId=${this.appointmentId}`;

    const result =
      await this.stripe.confirmPayment({

        elements: this.elements,

        confirmParams: {
          return_url: returnUrl
        },

        redirect: 'if_required'
      });

    if (result.error) {

      this.errorMessage =
        result.error.message ||
        'Payment failed';

      this.isPaying = false;
      this.cd.detectChanges();

      return;
    }

    const paymentIntent =
      result.paymentIntent;

    if (
      paymentIntent?.status ===
      'succeeded'
    ) {

      this.successMessage =
        'Payment completed successfully';

      this.isPaying = false;
      this.canPay = false;

      this.cd.detectChanges();

      setTimeout(() => {

        this.router.navigate(
          ['/payment-success'],
          {
            queryParams: {
              appointmentId:
                this.appointmentId,

              payment_intent:
                paymentIntent.id
            }
          }
        );

      }, 800);

      return;
    }

    if (
      paymentIntent?.status ===
      'processing'
    ) {

      this.successMessage =
        'Your payment is processing';

      this.isPaying = false;
      this.canPay = false;

      this.cd.detectChanges();

      setTimeout(() => {

        this.router.navigate(
          ['/payment-success'],
          {
            queryParams: {
              appointmentId:
                this.appointmentId
            }
          }
        );

      }, 800);

      return;
    }

    this.isPaying = false;
    this.cd.detectChanges();
  }

  private showError(
    message: string
  ): void {

    this.errorMessage = message;
    this.isLoading = false;
    this.canPay = false;

    this.cd.detectChanges();
  }

  cancel(): void {

    this.router.navigate([
      '/my-appointments'
    ]);
  }

  ngOnDestroy(): void {

    this.paymentElement?.destroy();
  }
}