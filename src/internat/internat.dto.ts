import { Prisma } from 'src/generated/prisma/client';

export class InternatTicketInputDto {
  surname: string;
  firstname: string;
  nickname: string;
  email: string;
  drap: boolean;
  goodies: boolean;
}

export class InternatCheckoutDto {
  items: InternatTicketInputDto[];
}

export type MaxTicketsDto = {
  max: number;
};

export type InternatCheckoutResponseDto = {
  paymentIntent: string;
  cancelToken: string;
  basket: {
    name: string;
    unitPrice: Prisma.Decimal;
    quantity: number;
  }[];
};

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
