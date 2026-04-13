import { Body, Controller, Get, Headers, Post, Query, RawBody } from '@nestjs/common';
import { PayementService, ValidateAdhesionEmailResult } from './payment.service';
import { StripeService } from './stripe.service';
import { CreateOrderDto } from './types/order';

/**
 * Handles all payment-related routes.
 *
 * Flow:
 *  1. POST /payment/validate-adhesion  — optional pre-check before adding adhesion to cart
 *  2. POST /payment/create-payment-intent — creates a Stripe PaymentIntent and saves a PENDING order
 *  3. Stripe redirects to /checkout?payment=success&payment_intent=pi_xxx
 *  4. GET  /payment/confirm-success    — verifies the intent, marks order PAID, creates tickets
 *
 * POST /payment/webhooks is Stripe's async fallback for steps 3+4 in case
 * the user closes the tab before the redirect fires.
 */
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PayementService,
    private readonly stripeService: StripeService,
  ) {}

  @Post('/create-payment-intent')
  createPaymentIntent(@Body() orderDto: CreateOrderDto) {
    return this.paymentService.createPayment(orderDto);
  }

  /**
   * Checks whether an email is already registered as adherent before the user
   * adds an adhesion product to the cart. Returns 409 Conflict if already adherent.
   */
  @Post('/validate-adhesion')
  validateAdhesion(@Body() body: { email?: string }): Promise<ValidateAdhesionEmailResult> {
    return this.paymentService.validateAdhesionEmail(body.email ?? '');
  }

  /**
   * Stripe webhook receiver. Verifies the signature to prevent spoofed events,
   * then delegates to the payment service.
   * Requires the raw request body (not parsed JSON) for signature verification.
   */
  @Post('webhooks')
  async handleStripeWebhook(
    @RawBody() event: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    const stripeEvent = this.stripeService.verifyWebhook(event, signature);
    await this.paymentService.handleStripeEvent(stripeEvent);
  }

  /**
   * Called by the frontend after Stripe redirects back with ?payment=success.
   * Verifies the PaymentIntent, marks the order PAID, and materialises tickets.
   */
  @Get('confirm-success')
  async confirmSuccessfulPayment(@Query('paymentIntentId') paymentIntentId: string) {
    return this.paymentService.confirmSuccessfulPayment(paymentIntentId);
  }
}
