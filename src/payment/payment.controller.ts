import { Body, Controller, Get, Headers, Post, Query, RawBody } from '@nestjs/common';
import { PayementService } from './payment.service';
import { StripeService } from './stripe.service';
import { CreateOrderDto } from './types/order';

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

  @Post('webhooks')
  async handleStripeWebhook(
    @RawBody() event: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    const stripeEvent = this.stripeService.verifyWebhook(event, signature);
    await this.paymentService.handleStripeEvent(stripeEvent);
  }

  @Get('confirm-success')
  async confirmSuccessfulPayment(@Query('paymentIntentId') paymentIntentId: string) {
    return this.paymentService.confirmSuccessfulPayment(paymentIntentId);
  }
}
