import { Injectable } from '@nestjs/common';
import { OrderStatus } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ORDER_INCLUDE } from './constant';
import { OrderWithItemsBuyer } from './order.types';
import { mapOrdersToOrdersListDto, mapOrderToDetailDto } from './order.utils';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

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
