import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/client';
import { OrderStatus } from 'src/generated/prisma/enums';
import { OrderService } from 'src/order/order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Stripe } from 'stripe';
import { StripeService } from './stripe.service';
import { CreateOrderDto } from './types/order';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
    private readonly orderService: OrderService,
  ) {}

  async createPayment(orderDto: CreateOrderDto) {
    const skus = await this.prisma.sku.findMany({
      where: {
        id: {
          in: orderDto.basket.map((item) => item.skuId),
        },
      },
      include: {
        product: true,
      },
    });

    if (skus.length !== orderDto.basket.length) {
      this.logger.error(
        `One or more SKUs not found: expected ${orderDto.basket.length}, found ${skus.length}`,
      );
      throw new BadRequestException('One or more SKUs not found');
    }

    const totalAmount = skus.reduce((total, sku) => {
      const quantity =
        orderDto.basket.find((item) => item.skuId === sku.id)?.quantity || 0;
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

    const user = await this.prisma.user.upsert({
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

    const orderItemsData = skus.map((item) => {
      const quantity = orderDto.basket.find(
        (i) => i.skuId === item.id,
      )?.quantity;
      if (!quantity) {
        throw new BadRequestException(
          `Quantity not found for SKU ${item.id}, product ${item.product.name}`,
        );
      }
      return {
        skuId: item.id,
        quantity,
        unitPrice: item.priceOverride ?? item.product.basePrice,
      };
    });

    const updatedOrder = await this.prisma.order.create({
      data: {
        userId: user.id,
        paymentIntentId: paymentIntent.split('_secret')[0],
        orderItems: {
          create: orderItemsData,
        },
      },
    });
    await this.orderService.destockOrderItems(updatedOrder);
    return paymentIntent;
  }

  async handleStripeEvent(event: Stripe.Event) {
    if (event.type === 'payment_intent.succeeded') {
      await this.orderService.updateStatusByPaymentIntentId(
        event.data.object.id,
        OrderStatus.PAID,
      );
    } else {
      this.logger.warn(`Unhandled Stripe event type: ${event.type}`);
    }
  }
}
