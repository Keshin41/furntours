import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/client';
import { OrderStatus } from 'src/generated/prisma/enums';
import { OrderCancellationService } from 'src/order/services/order-cancellation.service';
import { OrderCancelTokenService } from 'src/order/services/order-cancel-token.service';
import { OrderService } from 'src/order/order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Stripe } from 'stripe';
import { StripeService } from './stripe.service';
import {
  CreateOrderDto,
  CreatePaymentIntentResponseDto,
} from './types/order';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
    private readonly orderService: OrderService,
    private readonly orderCancellationService: OrderCancellationService,
    private readonly orderCancelTokenService: OrderCancelTokenService,
  ) {}

  async createPayment(
    orderDto: CreateOrderDto,
  ): Promise<CreatePaymentIntentResponseDto> {
    const groupedBasket = new Map<string, number>();
    for (const item of orderDto.basket) {
      groupedBasket.set(
        item.skuId,
        (groupedBasket.get(item.skuId) ?? 0) + item.quantity,
      );
    }

    const skuIds = [...groupedBasket.keys()];
    if (!skuIds.length) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const skus = await this.prisma.sku.findMany({
      where: {
        id: {
          in: skuIds,
        },
      },
      include: {
        product: true,
      },
    });

    if (skus.length !== skuIds.length) {
      const foundSkuIds = new Set(skus.map((sku) => sku.id));
      const missingSkuIds = skuIds.filter((id) => !foundSkuIds.has(id));
      this.logger.error(
        `One or more SKUs not found: missing [${missingSkuIds.join(', ')}]`,
      );
      throw new BadRequestException('One or more SKUs not found');
    }

    const totalAmount = skus.reduce((total, sku) => {
      const quantity = groupedBasket.get(sku.id) ?? 0;
      const price = sku.priceOverride ?? sku.product.basePrice;
      return price.mul(quantity).plus(total);
    }, new Decimal(0));

    const paymentIntent = await this.stripeService.createPaymentIntent(
      totalAmount.mul(100).toNumber(),
      orderDto.user.email,
    );

    if (!paymentIntent) {
      throw new InternalServerErrorException('Failed to create payment intent');
    }

    const paymentIntentId = paymentIntent.split('_secret')[0];

    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: {
          email: orderDto.user.email,
        },
        update: {
          firstname: orderDto.user.firstname,
          lastname: orderDto.user.lastname,
          nickname: orderDto.user.nickname,
          address: orderDto.user.address,
          city: orderDto.user.city,
          postalCode: orderDto.user.postalCode,
        },
        create: {
          email: orderDto.user.email,
          firstname: orderDto.user.firstname,
          lastname: orderDto.user.lastname,
          nickname: orderDto.user.nickname,
          address: orderDto.user.address,
          city: orderDto.user.city,
          postalCode: orderDto.user.postalCode,
        },
      });

      for (const sku of skus) {
        const quantity = groupedBasket.get(sku.id) ?? 0;

        if (sku.trackStock) {
          const updated = await tx.sku.updateMany({
            where: {
              id: sku.id,
              stock: {
                gte: quantity,
              },
            },
            data: {
              stock: {
                decrement: quantity,
              },
            },
          });

          if (updated.count === 0) {
            throw new BadRequestException(
              `Insufficient stock for ${sku.product.name} (${sku.skuCode})`,
            );
          }
        }
      }

      await tx.order.create({
        data: {
          userId: user.id,
          paymentIntentId,
          orderItems: {
            create: skus.map((sku) => ({
              skuId: sku.id,
              quantity: groupedBasket.get(sku.id) ?? 0,
              unitPrice: sku.priceOverride ?? sku.product.basePrice,
            })),
          },
        },
      });
    });

    return {
      paymentIntent,
      cancelToken: this.orderCancelTokenService.createToken(paymentIntentId),
    };
  }

  async cancelPayment(paymentIntentId: string, cancelToken?: string): Promise<void> {
    this.orderCancelTokenService.assertValidToken(paymentIntentId, cancelToken);
    await this.orderCancellationService.cancelPendingOrderByPaymentIntentId(
      paymentIntentId,
    );
  }

  async handleStripeEvent(event: Stripe.Event) {
    // Handle the event (e.g., update order status in the database)
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.orderService.updateStatusByPaymentIntentId(
          event.data.object.id,
          OrderStatus.PAID,
        );
        break;
      default:
        this.logger.warn(`Unhandled Stripe event type: ${event.type}`);
    }
  }
}
