import { OrderDetailDto, OrderListDto, OrderWithDetails, OrderWithItemsBuyer } from './order.types';

export const mapOrdersToOrdersListDto = (
  orders: OrderWithItemsBuyer[],
): OrderListDto[] => {
  return orders.map((order) => ({
    id: order.id,
    date: order.createdAt,
    amount: order.orderItems.reduce(
      (total, item) => total + item.unitPrice.toNumber() * item.quantity,
      0,
    ),
    quantity: order.orderItems.reduce(
      (total, item) => total + item.quantity,
      0,
    ),
    status: order.status,
    buyer: order.user.nickname || order.user.email,
  }));
};

export const mapOrderToDetailDto = (order: OrderWithDetails): OrderDetailDto => {
  return {
    id: order.id,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    paymentIntentId: order.paymentIntentId,
    buyer: {
      id: order.user.id,
      nickname: order.user.nickname,
      email: order.user.email,
    },
    items: order.orderItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toNumber(),
      sku: {
        id: item.sku.id,
        skuCode: item.sku.skuCode,
        product: {
          id: item.sku.product.id,
          name: item.sku.product.name,
          imageUrl: item.sku.product.imageUrl,
        },
      },
    })),
    total: order.orderItems.reduce(
      (sum, item) => sum + item.unitPrice.toNumber() * item.quantity,
      0,
    ),
  };
};
