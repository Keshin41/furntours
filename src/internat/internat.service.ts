import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// DTO representing one participant in the internat registration form.
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

// Result returned by the validate endpoint.
// `nonAdherentEmails` lists participants who don't yet have an adhesion
// so the frontend can auto-add the adhesion surcharge to the cart.
export interface ValidateInternatTicketsResult {
  ok: true;
  nonAdherentEmails: string[];
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

  /**
   * Returns the subset of the given emails that do NOT yet have an adhesion.
   * Duplicated from PaymentService intentionally: this check runs at validation
   * time (before the cart is finalised), whereas the payment service runs it
   * again just before charging the card.
   * An email is considered adherent if it has either:
   *  - a materialized Ticket on an ADHESION_ SKU, or
   *  - at least one PAID order containing an ADHESION_ line.
   */
  private async findNonAdherentEmails(emails: string[]): Promise<string[]> {
    if (emails.length === 0) {
      return [];
    }

    const users = await this.prismaService.user.findMany({
      where: {
        email: { in: emails },
      },
      select: {
        email: true,
        tickets: {
          where: {
            sku: {
              skuCode: {
                startsWith: 'ADHESION_',
              },
            },
          },
          select: {
            skuId: true,
          },
        },
        orders: {
          where: {
            status: 'PAID',
            orderItems: {
              some: {
                sku: {
                  skuCode: {
                    startsWith: 'ADHESION_',
                  },
                },
              },
            },
          },
          select: {
            id: true,
          },
        },
      },
    });

    const adherentEmailSet = new Set(
      users
        .filter((user) => user.tickets.length > 0 || user.orders.length > 0)
        .map((user) => user.email.toLowerCase()),
    );

    return emails.filter((email) => !adherentEmailSet.has(email));
  }

  /**
   * Pre-payment validation for an internat ticket batch.
   * Checks:
   *  1. At least one ticket is provided.
   *  2. No duplicate emails within the same request.
   *  3. None of the emails already hold an INTERNAT_2026 ticket (double-booking guard).
   * Returns the list of non-adherent emails so the frontend can auto-add adhesion lines.
   */
  validateTickets = async (data: ValidateInternatTicketsDto): Promise<ValidateInternatTicketsResult> => {
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

    const nonAdherentEmails = await this.findNonAdherentEmails(normalizedEmails);

    return {
      ok: true,
      nonAdherentEmails,
    };
  }

  /** Returns all materialised INTERNAT_2026 tickets with participant and pricing info, sorted by name. */
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

  /**
   * @deprecated The internat used to have its own checkout flow.
   * It now goes through the global cart + /payment/create-payment-intent.
   * Returns 410 Gone so old clients get a clear error.
   */
  processOrder = async () => {
    throw new HttpException(
      'Deprecated endpoint. Add internat tickets to the global cart and use /checkout.',
      HttpStatus.GONE,
    );
  }
}
