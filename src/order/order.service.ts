import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderStatus } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ORDER_INCLUDE } from './constant';
import { OrderWithItemsBuyer } from './order.types';
import { mapOrdersToOrdersListDto, mapOrderToDetailDto } from './order.utils';
import { CreateManualOrderDto } from './order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createManual(data: CreateManualOrderDto) {
    const groupedItems = new Map<string, number>();

    for (const item of data.items) {
      groupedItems.set(item.skuId, (groupedItems.get(item.skuId) ?? 0) + item.quantity);
    }

    const skuIds = [...groupedItems.keys()];

    if (!skuIds.length) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const createdOrder = await this.prisma.$transaction(async (tx) => {
      const skus = await tx.sku.findMany({
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
        throw new BadRequestException('One or more SKUs not found');
      }

      const skusById = new Map(skus.map((sku) => [sku.id, sku]));

      for (const [skuId, quantity] of groupedItems.entries()) {
        const sku = skusById.get(skuId);
        if (!sku) {
          throw new BadRequestException(`SKU ${skuId} not found`);
        }

        if (sku.trackStock) {
          const updated = await tx.sku.updateMany({
            where: {
              id: skuId,
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

      const user = await tx.user.upsert({
        where: {
          email: data.buyer.email,
        },
        update: {
          firstname: data.buyer.firstname,
          lastname: data.buyer.lastname,
          nickname: data.buyer.nickname,
          address: data.buyer.address,
          postalCode: data.buyer.postalCode,
          city: data.buyer.city,
        },
        create: {
          email: data.buyer.email,
          firstname: data.buyer.firstname,
          lastname: data.buyer.lastname,
          nickname: data.buyer.nickname,
          address: data.buyer.address,
          postalCode: data.buyer.postalCode,
          city: data.buyer.city,
        },
      });

      const status =
        data.paymentMethod === 'CASH'
          ? data.isPaid
            ? OrderStatus.CASH_PAID
            : OrderStatus.CASH_PENDING
          : data.isPaid
            ? OrderStatus.PAID
            : OrderStatus.PENDING;

      return tx.order.create({
        data: {
          userId: user.id,
          status,
          orderItems: {
            create: [...groupedItems.entries()].map(([skuId, quantity]) => {
              const sku = skusById.get(skuId);
              if (!sku) {
                throw new BadRequestException(`SKU ${skuId} not found`);
              }

              return {
                skuId,
                quantity,
                unitPrice: sku.priceOverride ?? sku.product.basePrice,
              };
            }),
          },
        },
        include: ORDER_INCLUDE,
      });
    });

    return mapOrderToDetailDto(createdOrder);
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

  async list(page: number, pageSize: number) {
    console.log('🚀 ~ OrderService ~ list ~ pageSize:', pageSize);
    const orders: OrderWithItemsBuyer[] = await this.prisma.order.findMany({
      include: {
        user: true,
        orderItems: true,
      },
      skip: page * pageSize,
      take: pageSize,
    });
    return mapOrdersToOrdersListDto(orders);
  }

  async count() {
    return this.prisma.order.count();
  }

  
  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: ORDER_INCLUDE,
    });

    if (!order) {
      return null;
    }

    return mapOrderToDetailDto(order);
  }

  async updateStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}
