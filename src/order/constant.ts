export const ORDER_INCLUDE = {
  user: {
    select: {
      id: true,
      nickname: true,
      email: true,
    },
  },
  orderItems: {
    include: {
      sku: {
        include: {
          product: true,
        },
      },
    },
  },
};
