import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { Stripe,StripeElements,StripePaymentElement,loadStripe } from '@stripe/stripe-js';
import { PaymentService } from '../../services/payment';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-payment-str',
  standalone: false,
  templateUrl: './payment-str.html',
  styleUrl: './payment-str.css',
})
export class PaymentStr implements AfterViewInit, OnDestroy {

  appointmentId = '';

  amount = 0;
  currency = 'AED';

  isLoading = true;
  isPaying = false;

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

    await this.initializeStripePayment();
  }

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
            this.amount = response.amount;
            this.currency =
              response.currency;

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

            this.paymentElement.mount(
              '#payment-element'
            );

            this.isLoading = false;
            this.cd.detectChanges();
          },

          error: (error) => {
            console.error(
              'Payment initialization error:',
              error
            );

            this.errorMessage =
              error.error?.message ||
              error.error?.error ||
              'Unable to initialize payment';

            this.isLoading = false;
            this.cd.detectChanges();
          }
        });

    } catch (error: any) {
      console.error(
        'Stripe loading error:',
        error
      );

      this.errorMessage =
        error.message ||
        'Unable to load Stripe';

      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  async payNow(): Promise<void> {
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

  cancel(): void {
    this.router.navigate([
      '/my-appointments'
    ]);
  }

  ngOnDestroy(): void {
    this.paymentElement?.destroy();
  }

}
