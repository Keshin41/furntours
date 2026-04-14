import { Module } from '@nestjs/common';
import { OrderModule } from 'src/order/order.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { StripeService } from './stripe.service';

@Module({
  imports: [OrderModule],
  providers: [StripeService, PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
