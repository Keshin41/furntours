import { Prisma } from 'src/generated/prisma/client';

export type OrderListDto = {
  id: string;
  date: Date;
  amount: number;
  quantity: number;
  status: string;
  buyer: string;
};

export type OrderWithItemsBuyer = Prisma.OrderGetPayload<{
  include: { orderItems: true; user: true };
}>;
