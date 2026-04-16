import { Module } from '@nestjs/common';
import { OrderCleanupService } from './order-cleanup.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderCleanupService],
  exports: [OrderService],
})
export class OrderModule {}
