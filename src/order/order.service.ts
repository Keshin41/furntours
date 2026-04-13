import { Injectable } from '@nestjs/common';
import { OrderStatus } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderWithItemsBuyer } from './order.types';
import { mapOrdersToOrdersListDto } from './order.utils';

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
}
