import { Injectable } from '@nestjs/common';
import { OrderStatus } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

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

    return orders
      .map((order) => {
        const shopItems = order.orderItems.filter(
          (orderItem) => !orderItem.sku.product.virtual,
        );

        if (shopItems.length === 0) {
          return null;
        }

        const items = shopItems.map((orderItem) => ({
          skuId: orderItem.skuId,
          skuCode: orderItem.sku.skuCode,
          productName: orderItem.sku.product.name,
          quantity: orderItem.quantity,
          unitPrice: orderItem.unitPrice.toString(),
          totalPrice: orderItem.unitPrice.mul(orderItem.quantity).toString(),
        }));

        const totalPrice = shopItems
          .reduce(
            (sum, orderItem) => sum.plus(orderItem.unitPrice.mul(orderItem.quantity)),
            shopItems[0]!.unitPrice.mul(0),
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
      })
      .filter((order): order is ShopOrderListItem => order !== null);
  }

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
