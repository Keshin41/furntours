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
};

@Injectable()
export class PayementService {
  private readonly logger = new Logger(PayementService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
    private readonly orderService: OrderService,
  ) {}

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

      const existingTicket = await this.prisma.ticket.findFirst({
        where: {
          userId: user.id,
          skuId: ticketLine.skuId,
        },
      });

      if (!existingTicket) {
        await this.prisma.ticket.create({
          data: {
            userId: user.id,
            skuId: ticketLine.skuId,
          },
        });
      }
    }
  }

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

    const latestCharge =
      paymentIntent.latest_charge && typeof paymentIntent.latest_charge !== 'string'
        ? paymentIntent.latest_charge
        : null;

    return {
      ok: true,
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

    const ticketLines = orderDto.basket
      .filter((item): item is TicketBasketLine => item.ticketDetails !== undefined)
      .map((item) => ({
        ...item,
        ticketDetails: {
          ...item.ticketDetails,
          email: item.ticketDetails.email.trim().toLowerCase(),
        },
      }));

    const duplicateTicketEmails = ticketLines
      .map((item) => item.ticketDetails.email)
      .filter((email, index, emails) => emails.indexOf(email) !== index)
      .filter((email, index, emails) => emails.indexOf(email) === index);

    if (duplicateTicketEmails.length > 0) {
      throw new BadRequestException(
        `Duplicate internat email(s): ${duplicateTicketEmails.join(', ')}`,
      );
    }

    for (const item of ticketLines) {
      if (item.quantity !== 1) {
        throw new BadRequestException('Internat tickets must have a quantity of 1 per line');
      }

      const sku = skuById.get(item.skuId);
      if (!sku || !sku.skuCode.startsWith('INTERNAT_2026')) {
        throw new BadRequestException('Invalid SKU for internat ticket');
      }
    }

    if (ticketLines.length > 0) {
      const usersWithExistingTicket = await this.prisma.user.findMany({
        where: {
          email: { in: ticketLines.map((item) => item.ticketDetails.email) },
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

    const totalAmount = orderDto.basket.reduce((total, item) => {
      const sku = skuById.get(item.skuId);
      if (!sku) {
        throw new BadRequestException(`SKU not found for basket item ${item.skuId}`);
      }
      const price = sku.priceOverride ?? sku.product.basePrice;
      return price.mul(item.quantity).plus(total);
    }, new Decimal(0));

    const paymentIntent = await this.stripeService.createPaymentIntent(
      totalAmount.mul(100).toNumber(),
      this.buildInternatMetadata(ticketLines),
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
