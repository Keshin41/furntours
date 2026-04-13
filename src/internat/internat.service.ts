import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export interface TicketDTO {
  surname: string;
  firstname: string;
  nickname: string;
  email: string;
  drap: boolean;
  goodies: boolean;
}

export interface ValidateInternatTicketsDto {
  items: TicketDTO[];
}

export interface InternatTicketListItem {
  email: string;
  firstname: string;
  lastname: string;
  nickname: string;
  skuCode: string;
  productName: string;
  unitPrice: string;
  drap: boolean;
  goodies: boolean;
}

@Injectable()
export class InternatService {
  constructor(private readonly prismaService: PrismaService){}

  validateTickets = async (data: ValidateInternatTicketsDto) => {
    const items = data.items as TicketDTO[];

    if (!Array.isArray(items) || items.length === 0) {
      throw new HttpException('No tickets provided', HttpStatus.BAD_REQUEST);
    }

    const normalizedEmails = items.map((item) => item.email.trim().toLowerCase());

    const duplicateEmails = normalizedEmails
      .filter((email, index, emails) => emails.indexOf(email) !== index)
      .filter((email, index, emails) => emails.indexOf(email) === index);

    if (duplicateEmails.length > 0) {
      throw new HttpException(
        `Duplicate email(s) in request: ${duplicateEmails.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const usersWithExistingInternatTicket = await this.prismaService.user.findMany({
      where: {
        email: { in: normalizedEmails },
        tickets: {
          some: {
            sku: {
              skuCode: {
                startsWith: 'INTERNAT_2026',
              },
            },
          },
        },
      },
      select: { email: true },
    });

    if (usersWithExistingInternatTicket.length > 0) {
      throw new HttpException(
        `Email(s) already registered for internat: ${usersWithExistingInternatTicket.map((user) => user.email).join(', ')}`,
        HttpStatus.CONFLICT,
      );
    }

    return { ok: true };
  }

  getTickets = async (): Promise<InternatTicketListItem[]> => {
    const tickets = await this.prismaService.ticket.findMany({
      include: {
        user: true,
        sku: {
          include: {
            product: true,
          },
        },
      },
      orderBy: [
        { user: { lastname: 'asc' } },
        { user: { firstname: 'asc' } },
        { user: { email: 'asc' } },
      ],
    });

    return tickets
      .filter((ticket) => ticket.sku.skuCode.startsWith('INTERNAT_2026'))
      .map((ticket) => ({
        email: ticket.user.email,
        firstname: ticket.user.firstname,
        lastname: ticket.user.lastname,
        nickname: ticket.user.nickname,
        skuCode: ticket.sku.skuCode,
        productName: ticket.sku.product.name,
        unitPrice: (ticket.sku.priceOverride ?? ticket.sku.product.basePrice).toString(),
        drap: ticket.sku.skuCode.includes('_DRAP'),
        goodies: ticket.sku.skuCode.includes('GOODIES'),
      }));
  }

  processOrder = async () => {
    throw new HttpException(
      'Deprecated endpoint. Add internat tickets to the global cart and use /checkout.',
      HttpStatus.GONE,
    );
  }
}
