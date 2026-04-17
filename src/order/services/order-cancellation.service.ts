import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from 'src/payment/stripe.service';

@Injectable()
export class OrderCancellationService {
  private readonly logger = new Logger(OrderCancellationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  private async restockOrderItemsTx(
    tx: Prisma.TransactionClient,
    orderId: string,
  ): Promise<void> {
    const orderItems = await tx.orderItem.findMany({
      where: { orderId },
      include: { sku: true },
    });

    for (const item of orderItems) {
      if (item.sku.skuCode.startsWith('INTERNAT_2026')) {
        await tx.sku.update({
          where: { skuCode: 'INTERNAT_2026' },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      } else {
        await tx.sku.update({
          where: { id: item.skuId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    }
  }

  async cancelPendingOrderByPaymentIntentId(
    paymentIntentId: string,
  ): Promise<void> {
    const order = await this.prisma.order.findUnique({
      where: { paymentIntentId },
    });

    if (!order || order.status !== 'PENDING') {
      throw new NotFoundException('Commande introuvable ou déjà traitée');
    }

    try {
      const stripeCanceled =
        await this.stripeService.cancelPaymentIntent(paymentIntentId);

      if (!stripeCanceled) {
        throw new InternalServerErrorException(
          'Payment non annule, restock interrompu',
        );
      }

      await this.prisma.$transaction(async (tx) => {
        const updated = await tx.order.updateMany({
          where: {
            id: order.id,
            status: 'PENDING',
          },
          data: { status: 'FAILED' },
        });

        if (updated.count === 0) {
          throw new NotFoundException('Commande introuvable ou deja traitee');
        }

        await this.restockOrderItemsTx(tx, order.id);
      });
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      this.logger.error(
        `Failed to cancel/revert order ${order.id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException(
        'Impossible d annuler la commande pour le moment',
      );
    }
  }

  async expirePendingOrderWithoutPaymentIntent(orderId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const updated = await tx.order.updateMany({
        where: {
          id: orderId,
          status: 'PENDING',
          paymentIntentId: null,
        },
        data: { status: 'FAILED' },
      });

      if (updated.count === 0) {
        throw new NotFoundException('Commande introuvable ou deja traitee');
      }

      await this.restockOrderItemsTx(tx, orderId);
    });
  }
}