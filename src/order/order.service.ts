import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/client';
import { OrderStatus } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

// Shape returned to the admin order list.
export interface ShopOrderListItem {
  id: string;
  status: OrderStatus;
  createdAt: string;
  buyer: {
    email: string;
    firstname: string;
    lastname: string;
    nickname: string;
  };
  items: Array<{
    skuId: string;
    skuCode: string;
    productName: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
  }>;
  totalPrice: string;
}

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  /** Returns all orders (shop products, internat tickets, adhesions, etc.), sorted by date desc. */
  async listShopOrders(): Promise<ShopOrderListItem[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        user: true,
        orderItems: {
          include: {
            sku: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map((order) => {
      const items = order.orderItems.map((orderItem) => ({
        skuId: orderItem.skuId,
        skuCode: orderItem.sku.skuCode,
        productName: orderItem.sku.product.name,
        quantity: orderItem.quantity,
        unitPrice: orderItem.unitPrice.toString(),
        totalPrice: orderItem.unitPrice.mul(orderItem.quantity).toString(),
      }));

      const totalPrice = order.orderItems
        .reduce(
          (sum, orderItem) => sum.plus(orderItem.unitPrice.mul(orderItem.quantity)),
          new Decimal(0),
        )
        .toString();

      return {
        id: order.id,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        buyer: {
          email: order.user.email,
          firstname: order.user.firstname,
          lastname: order.user.lastname,
          nickname: order.user.nickname,
        },
        items,
        totalPrice,
      };
    });
  }

  /** Transitions an order to a new status, looked up by its Stripe PaymentIntent ID. */
  async updateStatusByPaymentIntentId(
    paymentIntentId: string,
    status: OrderStatus,
  ) {
    await this.prisma.order.update({
      where: {
        paymentIntentId,
      },
      data: {
        status,
      },
    });
  }
}
