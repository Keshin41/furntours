import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderStatus } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderCancellationService } from '../services/order-cancellation.service';

@Injectable()
export class OrderCleanupTask {
  private readonly logger = new Logger(OrderCleanupTask.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly orderCancellationService: OrderCancellationService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async expireStalePendingOrders() {
    const cutoff = new Date(Date.now() - 1 * 60 * 1000);

    const staleOrders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.PENDING,
        createdAt: {
          lt: cutoff,
        },
      },
    });

    if (staleOrders.length === 0) {
      return;
    }

    this.logger.log(
      `Found ${staleOrders.length} stale PENDING order(s) — marking as FAILED and restoring stock`,
    );

    for (const order of staleOrders) {
      try {
        if (order.paymentIntentId) {
          await this.orderCancellationService.cancelPendingOrderByPaymentIntentId(
            order.paymentIntentId,
          );
          this.logger.log(`Order ${order.id} marked as FAILED, stock restored`);
          continue;
        }

        // Fallback for stale PENDING orders that have no Stripe payment intent.
        await this.orderCancellationService.expirePendingOrderWithoutPaymentIntent(
          order.id,
        );

        this.logger.log(`Order ${order.id} marked as FAILED, stock restored`);
      } catch (err) {
        this.logger.error(
          `Failed to process stale order ${order.id}: ${(err as Error).message}`,
        );
      }
    }
  }
}
