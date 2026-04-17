import { Module } from '@nestjs/common';
import { OrderModule } from 'src/order/order.module';
import { StripeService } from 'src/payment/stripe.service';
import { InternatController } from './internat.controller';
import { InternatService } from './internat.service';

@Module({
  imports: [OrderModule],
  controllers: [InternatController],
  providers: [StripeService, InternatService],
})
export class InternatModule {}
