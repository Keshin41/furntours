import {
  Body,
  Controller,
  Delete,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  RawBody,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { StripeService } from './stripe.service';
import {
  CreateOrderDto,
  CreatePaymentIntentResponseDto,
} from './types/order';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly stripeService: StripeService,
  ) {}

  @Post('/create-payment-intent')
  createPaymentIntent(
    @Body() orderDto: CreateOrderDto,
  ): Promise<CreatePaymentIntentResponseDto> {
    return this.paymentService.createPayment(orderDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/checkout/:paymentIntentId')
  cancelPayment(
    @Param('paymentIntentId') paymentIntentId: string,
    @Headers('x-cancel-token') cancelToken?: string,
  ): Promise<void> {
    return this.paymentService.cancelPayment(paymentIntentId, cancelToken);
  }

  @Post('webhooks')
  async handleStripeWebhook(
    @RawBody() event: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    const stripeEvent = this.stripeService.verifyWebhook(event, signature);
    await this.paymentService.handleStripeEvent(stripeEvent);
  }
}
