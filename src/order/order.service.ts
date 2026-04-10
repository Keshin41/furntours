import { Injectable } from '@nestjs/common';
import { OrderStatus } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
