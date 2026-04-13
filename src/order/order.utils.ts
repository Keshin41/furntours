import { OrderListDto, OrderWithItemsBuyer } from './order.types';

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
