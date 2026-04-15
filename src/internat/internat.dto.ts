import { Prisma } from 'src/generated/prisma/client';

export type TicketListDto = {
  email: string;
  nickname: string;
  date: Date;
  goodies: boolean;
  duvet: boolean;
};

export type TicketsWithUsersSkuOrder = Prisma.TicketGetPayload<{
  include: {
    user: true;
    sku: true;
    order: true;
  };
}>;
