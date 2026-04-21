import { Module } from '@nestjs/common';
import { StripeService } from 'src/payment/stripe.service';
import { OrderCleanupService } from './order-cleanup.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderCleanupService, StripeService],
  exports: [OrderService],
})
export class OrderModule {}
