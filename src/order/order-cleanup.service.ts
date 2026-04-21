import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderStatus } from 'src/generated/prisma/client';
import { StripeService } from 'src/payment/stripe.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderService } from './order.service';

@Injectable()
export class OrderCleanupService {
  private readonly logger = new Logger(OrderCleanupService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrderService,
    private readonly stripeService: StripeService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async expireStalePendingOrders() {
    const cutoff = new Date(Date.now() - 15 * 60 * 1000);

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
        await this.orderService.restockOrderItems(order);

        if (order.paymentIntentId) {
          await this.stripeService.cancelPayment(order.paymentIntentId);
        }

        await this.prisma.order.update({
          where: { id: order.id },
          data: { status: OrderStatus.FAILED },
        });

        this.logger.log(`Order ${order.id} marked as FAILED, stock restored`);
      } catch (err) {
        this.logger.error(
          `Failed to process stale order ${order.id}: ${(err as Error).message}`,
        );
      }
    }
  }
}
