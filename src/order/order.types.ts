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

export type OrderBuyer = {
  id: string;
  nickname: string;
  email: string;
};

export type OrderItemDetail = {
  id: string;
  quantity: number;
  unitPrice: number;
  sku: {
    id: string;
    skuCode: string;
    product: {
      id: string;
      name: string;
      imageUrl: string | null;
    };
  };
};

export type OrderDetailDto = {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  paymentIntentId: string | null;
  buyer: OrderBuyer;
  items: OrderItemDetail[];
  total: number;
};

export type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    user: { select: { id: true; nickname: true; email: true } };
    orderItems: {
      include: {
        sku: {
          include: { product: true };
        };
      };
    };
  };
}>;
