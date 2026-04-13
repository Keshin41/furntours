import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/client';
import { OrderStatus } from 'src/generated/prisma/enums';
import { OrderService } from 'src/order/order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Stripe } from 'stripe';
import { StripeService } from './stripe.service';
import { CreateOrderDto } from './types/order';

type TicketBasketDetails = {
  email: string;
  firstname: string;
  lastname: string;
  nickname: string;
  drap: boolean;
  goodies: boolean;
};

type TicketBasketLine = {
  skuId: string;
  quantity: number;
  ticketDetails: TicketBasketDetails;
};

export type ConfirmSuccessfulPaymentResult = {
  ok: true;
  paymentTicket: {
    paymentIntentId: string;
    chargeId: string | null;
    receiptUrl: string | null;
    amount: number;
    currency: string;
  };
  orderItems: Array<{
    productName: string;
    skuCode: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
};

export type ValidateAdhesionEmailResult = {
  ok: true;
};

@Injectable()
export class PayementService {
  private readonly logger = new Logger(PayementService.name);
  private static readonly ADHESION_SKU_CODE = 'ADHESION_2026';
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
    private readonly orderService: OrderService,
  ) {}

  /**
   * Returns the subset of the given emails that do NOT yet have an adhesion.
   * An email is considered adherent if it has either:
   *  - a materialized Ticket linked to an ADHESION_ SKU, or
   *  - at least one PAID order that contains an ADHESION_ line
   *    (covers the window between payment and webhook ticket creation).
   */
  private async findNonAdherentEmails(emails: string[]): Promise<string[]> {
    if (emails.length === 0) {
      return [];
    }

    const users = await this.prisma.user.findMany({
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
            status: OrderStatus.PAID,
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

  async validateAdhesionEmail(email: string): Promise<ValidateAdhesionEmailResult> {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      throw new BadRequestException('Email is required');
    }

    const nonAdherentEmails = await this.findNonAdherentEmails([normalizedEmail]);
    if (nonAdherentEmails.length === 0) {
      throw new ConflictException(`Email already registered as adherent: ${normalizedEmail}`);
    }

    return { ok: true };
  }

  /**
   * Serialises internat ticket nominee data into Stripe PaymentIntent metadata.
   * Stripe metadata values must be strings, so each field is stored as a numbered key
   * (e.g. internatTicket0Email, internatTicket1Email, …).
   */
  private buildInternatMetadata(ticketLines: TicketBasketLine[]) {
    const metadata: Record<string, string> = {
      internatTicketCount: String(ticketLines.length),
    };

    ticketLines.forEach((line, index) => {
      metadata[`internatTicket${index}SkuId`] = line.skuId;
      metadata[`internatTicket${index}Email`] = line.ticketDetails.email;
      metadata[`internatTicket${index}Firstname`] = line.ticketDetails.firstname;
      metadata[`internatTicket${index}Lastname`] = line.ticketDetails.lastname;
      metadata[`internatTicket${index}Nickname`] = line.ticketDetails.nickname;
    });

    return metadata;
  }

  /** Same serialisation pattern as buildInternatMetadata, but for nominative adhesion lines. */
  private buildAdhesionMetadata(adhesionLines: TicketBasketLine[]) {
    const metadata: Record<string, string> = {
      adhesionLineCount: String(adhesionLines.length),
    };

    adhesionLines.forEach((line, index) => {
      metadata[`adhesionLine${index}SkuId`] = line.skuId;
      metadata[`adhesionLine${index}Email`] = line.ticketDetails.email;
      metadata[`adhesionLine${index}Firstname`] = line.ticketDetails.firstname;
      metadata[`adhesionLine${index}Lastname`] = line.ticketDetails.lastname;
      metadata[`adhesionLine${index}Nickname`] = line.ticketDetails.nickname;
    });

    return metadata;
  }

  /** Deserialises internat ticket lines from PaymentIntent metadata (reverse of buildInternatMetadata). */
  private extractInternatMetadata(paymentIntent: Stripe.PaymentIntent): TicketBasketLine[] {
    const ticketCount = Number(paymentIntent.metadata.internatTicketCount ?? '0');

    return Array.from({ length: ticketCount }, (_, index) => {
      const skuId = paymentIntent.metadata[`internatTicket${index}SkuId`];
      const email = paymentIntent.metadata[`internatTicket${index}Email`];
      const firstname = paymentIntent.metadata[`internatTicket${index}Firstname`];
      const lastname = paymentIntent.metadata[`internatTicket${index}Lastname`];
      const nickname = paymentIntent.metadata[`internatTicket${index}Nickname`];

      if (!skuId || !email || !firstname || !lastname || !nickname) {
        throw new BadRequestException('Missing internat ticket metadata in payment intent');
      }

      return {
        skuId,
        quantity: 1,
        ticketDetails: {
          email,
          firstname,
          lastname,
          nickname,
          drap: false,
          goodies: false,
        },
      };
    });
  }

  /** Deserialises adhesion lines from PaymentIntent metadata (reverse of buildAdhesionMetadata). */
  private extractAdhesionMetadata(paymentIntent: Stripe.PaymentIntent): TicketBasketLine[] {
    const adhesionCount = Number(paymentIntent.metadata.adhesionLineCount ?? '0');

    return Array.from({ length: adhesionCount }, (_, index) => {
      const skuId = paymentIntent.metadata[`adhesionLine${index}SkuId`];
      const email = paymentIntent.metadata[`adhesionLine${index}Email`];
      const firstname = paymentIntent.metadata[`adhesionLine${index}Firstname`];
      const lastname = paymentIntent.metadata[`adhesionLine${index}Lastname`];
      const nickname = paymentIntent.metadata[`adhesionLine${index}Nickname`];

      if (!skuId || !email || !firstname || !lastname || !nickname) {
        throw new BadRequestException('Missing adhesion metadata in payment intent');
      }

      return {
        skuId,
        quantity: 1,
        ticketDetails: {
          email,
          firstname,
          lastname,
          nickname,
          drap: false,
          goodies: false,
        },
      };
    });
  }

  /**
   * Creates a Ticket row only if it doesn't already exist (idempotent).
   * Returns true if a new ticket was created, false if it already existed.
   * This makes it safe to call from both the webhook handler and the confirm endpoint.
   */
  private async createTicketIfMissing(userId: string, skuId: string): Promise<boolean> {
    const existingTicket = await this.prisma.ticket.findFirst({
      where: {
        userId,
        skuId,
      },
    });

    if (existingTicket) {
      return false;
    }

    await this.prisma.ticket.create({
      data: {
        userId,
        skuId,
      },
    });

    return true;
  }

  /**
   * After a successful payment, creates (or updates) a User record for each
   * internat ticket nominee and attaches the corresponding Ticket.
   * Upsert on email ensures re-running is safe and keeps user info up to date.
   */
  private async materializePaidInternatTickets(paymentIntent: Stripe.PaymentIntent) {
    const ticketLines = this.extractInternatMetadata(paymentIntent);

    for (const ticketLine of ticketLines) {
      const user = await this.prisma.user.upsert({
        where: { email: ticketLine.ticketDetails.email },
        update: {
          firstname: ticketLine.ticketDetails.firstname,
          lastname: ticketLine.ticketDetails.lastname,
          nickname: ticketLine.ticketDetails.nickname,
        },
        create: {
          email: ticketLine.ticketDetails.email,
          firstname: ticketLine.ticketDetails.firstname,
          lastname: ticketLine.ticketDetails.lastname,
          nickname: ticketLine.ticketDetails.nickname,
        },
      });

      await this.createTicketIfMissing(user.id, ticketLine.skuId);
    }
  }

  /**
   * After a successful payment, resolves and creates adhesion tickets:
   *
   * 1. Explicit adhesion lines — nominative lines added in the shop or auto-added
   *    for internat participants. Each one upserts a User and creates a Ticket.
   *
   * 2. Implicit adhesion lines — if the basket had more adhesion qty than explicit
   *    lines (e.g. the user bought extra), the remaining quota is assigned to any
   *    still-non-adherent internat participant, then to the order owner as fallback.
   *
   * Uses `remainingAdhesions` as a counter to avoid over-assigning tickets.
   */
  private async materializePaidAdhesions(paymentIntent: Stripe.PaymentIntent) {
    const order = await this.prisma.order.findUnique({
      where: {
        paymentIntentId: paymentIntent.id,
      },
      include: {
        user: true,
        orderItems: {
          include: {
            sku: true,
          },
        },
      },
    });

    if (!order) {
      throw new BadRequestException('Order not found for payment intent');
    }

    const adhesionOrderItems = order.orderItems.filter((orderItem) =>
      orderItem.sku.skuCode.startsWith('ADHESION_'),
    );

    if (adhesionOrderItems.length === 0) {
      return;
    }

    let remainingAdhesions = adhesionOrderItems.reduce(
      (count, orderItem) => count + orderItem.quantity,
      0,
    );

    const adhesionSkuId = adhesionOrderItems[0]?.skuId;
    if (!adhesionSkuId) {
      return;
    }

    const adhesionLines = this.extractAdhesionMetadata(paymentIntent);

    for (const adhesionLine of adhesionLines) {
      const user = await this.prisma.user.upsert({
        where: { email: adhesionLine.ticketDetails.email },
        update: {
          firstname: adhesionLine.ticketDetails.firstname,
          lastname: adhesionLine.ticketDetails.lastname,
          nickname: adhesionLine.ticketDetails.nickname,
        },
        create: {
          email: adhesionLine.ticketDetails.email,
          firstname: adhesionLine.ticketDetails.firstname,
          lastname: adhesionLine.ticketDetails.lastname,
          nickname: adhesionLine.ticketDetails.nickname,
        },
      });

      await this.createTicketIfMissing(user.id, adhesionLine.skuId);
      remainingAdhesions -= adhesionLine.quantity;
    }

    const ticketLines = this.extractInternatMetadata(paymentIntent);
    const nonAdherentEmails = await this.findNonAdherentEmails(
      ticketLines.map((line) => line.ticketDetails.email),
    );

    for (const ticketLine of ticketLines) {
      if (
        remainingAdhesions <= 0 ||
        !nonAdherentEmails.includes(ticketLine.ticketDetails.email)
      ) {
        continue;
      }

      const user = await this.prisma.user.upsert({
        where: { email: ticketLine.ticketDetails.email },
        update: {
          firstname: ticketLine.ticketDetails.firstname,
          lastname: ticketLine.ticketDetails.lastname,
          nickname: ticketLine.ticketDetails.nickname,
        },
        create: {
          email: ticketLine.ticketDetails.email,
          firstname: ticketLine.ticketDetails.firstname,
          lastname: ticketLine.ticketDetails.lastname,
          nickname: ticketLine.ticketDetails.nickname,
        },
      });

      const created = await this.createTicketIfMissing(user.id, adhesionSkuId);
      if (created) {
        remainingAdhesions -= 1;
      }
    }

    if (remainingAdhesions > 0) {
      await this.createTicketIfMissing(order.userId, adhesionSkuId);
    }
  }

  /**
   * Called by the frontend redirect endpoint after Stripe redirects back with ?payment=success.
   * Responsibilities:
   *  1. Verify the PaymentIntent actually succeeded (guard against URL manipulation).
   *  2. Mark the corresponding Order as PAID in the DB.
   *  3. Materialise internat tickets and adhesions from PaymentIntent metadata.
   *  4. Return a receipt summary (charge + order lines) to display on the confirmation page.
   *
   * Note: the webhook handler (handleStripeEvent) also calls steps 2–3 as a fallback
   * in case the frontend redirect never fires (closed tab, network error, etc.).
   */
  async confirmSuccessfulPayment(paymentIntentId: string): Promise<ConfirmSuccessfulPaymentResult> {
    const paymentIntent = await this.stripeService.retrievePaymentIntent(
      paymentIntentId,
      true,
    );

    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException('Payment intent is not succeeded');
    }

    await this.orderService.updateStatusByPaymentIntentId(
      paymentIntent.id,
      OrderStatus.PAID,
    );
    await this.materializePaidInternatTickets(paymentIntent);
    await this.materializePaidAdhesions(paymentIntent);

    const order = await this.prisma.order.findUnique({
      where: { paymentIntentId: paymentIntent.id },
      include: {
        orderItems: {
          include: {
            sku: {
              include: { product: true },
            },
          },
        },
      },
    });

    const orderItems =
      order?.orderItems.map((item) => ({
        productName: item.sku.product.name,
        skuCode: item.sku.skuCode,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.unitPrice) * item.quantity,
      })) ?? [];

    const latestCharge =
      paymentIntent.latest_charge && typeof paymentIntent.latest_charge !== 'string'
        ? paymentIntent.latest_charge
        : null;

    return {
      ok: true,
      orderItems,
      paymentTicket: {
        paymentIntentId: paymentIntent.id,
        chargeId: latestCharge?.id ?? null,
        receiptUrl: latestCharge?.receipt_url ?? null,
        amount: paymentIntent.amount_received || paymentIntent.amount,
        currency: paymentIntent.currency.toUpperCase(),
      },
    };
  }

  async createPayment(orderDto: CreateOrderDto) {
    const uniqueSkuIds = [...new Set(orderDto.basket.map((item) => item.skuId))];
    const skus = await this.prisma.sku.findMany({
      where: {
        id: {
          in: uniqueSkuIds,
        },
      },
      include: {
        product: true,
      },
    });

    const skuById = new Map(skus.map((sku) => [sku.id, sku]));

    if (skus.length !== uniqueSkuIds.length) {
      this.logger.error(
        `One or more SKUs not found: expected ${uniqueSkuIds.length}, found ${skus.length}`,
      );
      throw new BadRequestException('One or more SKUs not found');
    }

    const unnamedAdhesionLine = orderDto.basket.find((item) => {
      const sku = skuById.get(item.skuId);
      return sku?.skuCode.startsWith('ADHESION_') && item.ticketDetails === undefined;
    });

    if (unnamedAdhesionLine) {
      throw new BadRequestException(
        'Adhesion products require firstname, lastname, nickname, and email',
      );
    }

    const ticketLines = orderDto.basket
      .filter((item): item is TicketBasketLine => item.ticketDetails !== undefined)
      .map((item) => ({
        ...item,
        ticketDetails: {
          ...item.ticketDetails,
          email: item.ticketDetails.email.trim().toLowerCase(),
        },
      }));

    const adhesionLines = ticketLines.filter((item) => {
      const sku = skuById.get(item.skuId);
      return sku?.skuCode.startsWith('ADHESION_') ?? false;
    });

    const internatTicketLines = ticketLines.filter((item) => {
      const sku = skuById.get(item.skuId);
      return sku?.skuCode.startsWith('INTERNAT_2026') ?? false;
    });

    const duplicateTicketEmails = internatTicketLines
      .map((item) => item.ticketDetails.email)
      .filter((email, index, emails) => emails.indexOf(email) !== index)
      .filter((email, index, emails) => emails.indexOf(email) === index);

    if (duplicateTicketEmails.length > 0) {
      throw new BadRequestException(
        `Duplicate internat email(s): ${duplicateTicketEmails.join(', ')}`,
      );
    }

    const duplicateAdhesionEmails = adhesionLines
      .map((item) => item.ticketDetails.email)
      .filter((email, index, emails) => emails.indexOf(email) !== index)
      .filter((email, index, emails) => emails.indexOf(email) === index);

    if (duplicateAdhesionEmails.length > 0) {
      throw new BadRequestException(
        `Duplicate adhesion email(s): ${duplicateAdhesionEmails.join(', ')}`,
      );
    }

    for (const item of internatTicketLines) {
      if (item.quantity !== 1) {
        throw new BadRequestException('Internat tickets must have a quantity of 1 per line');
      }

      const sku = skuById.get(item.skuId);
      if (!sku || !sku.skuCode.startsWith('INTERNAT_2026')) {
        throw new BadRequestException('Invalid SKU for internat ticket');
      }
    }

    for (const item of adhesionLines) {
      if (item.quantity !== 1) {
        throw new BadRequestException('Adhesion lines must have a quantity of 1 per line');
      }

      const sku = skuById.get(item.skuId);
      if (!sku || !sku.skuCode.startsWith('ADHESION_')) {
        throw new BadRequestException('Invalid SKU for adhesion line');
      }
    }

    if (internatTicketLines.length > 0) {
      const usersWithExistingTicket = await this.prisma.user.findMany({
        where: {
          email: { in: internatTicketLines.map((item) => item.ticketDetails.email) },
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

      if (usersWithExistingTicket.length > 0) {
        throw new ConflictException(
          `Email(s) already registered for internat: ${usersWithExistingTicket.map((user) => user.email).join(', ')}`,
        );
      }
    }

    if (adhesionLines.length > 0) {
      const adhesionEmails = adhesionLines.map((item) => item.ticketDetails.email);
      const nonAdherentAdhesionEmails = await this.findNonAdherentEmails(adhesionEmails);
      const alreadyAdherentEmails = adhesionEmails.filter(
        (email, index, emails) =>
          !nonAdherentAdhesionEmails.includes(email) && emails.indexOf(email) === index,
      );

      if (alreadyAdherentEmails.length > 0) {
        throw new ConflictException(
          `Email(s) already registered as adherent: ${alreadyAdherentEmails.join(', ')}`,
        );
      }
    }

    const internatEmails = internatTicketLines.map((item) => item.ticketDetails.email);
    const nonAdherentEmails = await this.findNonAdherentEmails(internatEmails);

    const adhesionSku = await this.prisma.sku.findUnique({
      where: {
        skuCode: PayementService.ADHESION_SKU_CODE,
      },
      include: {
        product: true,
      },
    });

    if (nonAdherentEmails.length > 0 && !adhesionSku) {
      throw new InternalServerErrorException(
        `Required SKU ${PayementService.ADHESION_SKU_CODE} not found`,
      );
    }

    const adhesionQuantityAlreadyInBasket = orderDto.basket.reduce((count, basketItem) => {
      const sku = skuById.get(basketItem.skuId);
      if (sku?.skuCode === PayementService.ADHESION_SKU_CODE) {
        return count + basketItem.quantity;
      }
      return count;
    }, 0);

    const adhesionQuantityToAdd = Math.max(
      nonAdherentEmails.length - adhesionQuantityAlreadyInBasket,
      0,
    );

    const totalAmount = orderDto.basket.reduce((total, item) => {
      const sku = skuById.get(item.skuId);
      if (!sku) {
        throw new BadRequestException(`SKU not found for basket item ${item.skuId}`);
      }
      const price = sku.priceOverride ?? sku.product.basePrice;
      return price.mul(item.quantity).plus(total);
    }, new Decimal(0));

    const totalAmountWithAdhesion =
      adhesionQuantityToAdd > 0 && adhesionSku
        ? totalAmount.plus(
            (adhesionSku.priceOverride ?? adhesionSku.product.basePrice).mul(
              adhesionQuantityToAdd,
            ),
          )
        : totalAmount;

    const paymentIntent = await this.stripeService.createPaymentIntent(
      totalAmountWithAdhesion.mul(100).toNumber(),
      {
        ...this.buildInternatMetadata(internatTicketLines),
        ...this.buildAdhesionMetadata(adhesionLines),
      },
    );

    if (!paymentIntent) {
      throw new InternalServerErrorException('Failed to create payment intent');
    }

    const user = await this.prisma.user.upsert({
      where: {
        email: orderDto.user.email,
      },
      update: {
        firstname: orderDto.user.firstname,
        lastname: orderDto.user.lastname,
        nickname: orderDto.user.nickname,
        address: orderDto.user.address,
        city: orderDto.user.city,
        postalCode: orderDto.user.postalCode,
      },
      create: {
        email: orderDto.user.email,
        firstname: orderDto.user.firstname,
        lastname: orderDto.user.lastname,
        nickname: orderDto.user.nickname,
        address: orderDto.user.address,
        city: orderDto.user.city,
        postalCode: orderDto.user.postalCode,
      },
    });

    const orderItemsData = orderDto.basket.map((basketItem) => {
      const item = skuById.get(basketItem.skuId);
      if (!item) {
        throw new BadRequestException(
          `SKU not found for basket item ${basketItem.skuId}`,
        );
      }
      return {
        skuId: item.id,
        quantity: basketItem.quantity,
        unitPrice: item.priceOverride ?? item.product.basePrice,
      };
    });

    if (adhesionQuantityToAdd > 0 && adhesionSku) {
      orderItemsData.push({
        skuId: adhesionSku.id,
        quantity: adhesionQuantityToAdd,
        unitPrice: adhesionSku.priceOverride ?? adhesionSku.product.basePrice,
      });
    }

    await this.prisma.order.create({
      data: {
        userId: user.id,
        paymentIntentId: paymentIntent.split('_secret')[0],
        orderItems: {
          create: orderItemsData,
        },
      },
    });
    console.log(
      '🚀 ~ PayementService ~ createPayment ~ paymentIntent:',
      paymentIntent,
    );
    return paymentIntent;
  }

  async handleStripeEvent(event: Stripe.Event) {
    // Handle the event (e.g., update order status in the database)
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.orderService.updateStatusByPaymentIntentId(
          paymentIntent.id,
          OrderStatus.PAID,
        );
        await this.materializePaidInternatTickets(paymentIntent);
        await this.materializePaidAdhesions(paymentIntent);
        break;
      }
      case 'payment_intent.payment_failed':
        await this.orderService.updateStatusByPaymentIntentId(
          event.data.object.id,
          OrderStatus.FAILED,
        );
        break;
      default:
        this.logger.warn(`Unhandled Stripe event type: ${event.type}`);
    }
  }
}
