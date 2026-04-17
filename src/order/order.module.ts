import { Module } from '@nestjs/common';
import { StripeService } from 'src/payment/stripe.service';
import { OrderCancellationService } from './services/order-cancellation.service';
import { OrderCancelTokenService } from './services/order-cancel-token.service';
import { OrderCleanupTask } from './tasks/order-cleanup.task';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderCleanupTask,
    OrderCancellationService,
    OrderCancelTokenService,
    StripeService,
  ],
  exports: [OrderService, OrderCancellationService, OrderCancelTokenService],
})
export class OrderModule {}
