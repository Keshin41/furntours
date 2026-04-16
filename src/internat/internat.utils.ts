import { TicketListDto, TicketsWithUsersSkuOrder } from './internat.dto';

export const mapTicketsToTicketListDto = (
  tickets: TicketsWithUsersSkuOrder[],
): TicketListDto[] => {
  return tickets.map((ticket) => ({
    email: ticket.user.email,
    nickname: ticket.user.nickname,
    date: ticket.order.createdAt,
    goodies: ticket.sku.skuCode.includes('GOODIES'),
    duvet: ticket.sku.skuCode.includes('DRAP'),
  }));
};
