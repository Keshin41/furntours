import { Module } from '@nestjs/common';
import { StripeService } from 'src/payment/stripe.service';
import { OrderCleanupTask } from './tasks/order-cleanup.task';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderCleanupTask, StripeService],
  exports: [OrderService],
})
export class OrderModule {}
