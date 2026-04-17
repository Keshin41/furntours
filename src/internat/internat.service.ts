import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/client';
import { OrderCancellationService } from 'src/order/services/order-cancellation.service';
import { OrderCancelTokenService } from 'src/order/services/order-cancel-token.service';
import { PAID_STATUSES } from 'src/order/order.types';
import { StripeService } from 'src/payment/stripe.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  InternatCheckoutDto,
  InternatCheckoutResponseDto,
  InternatTicketInputDto,
  MaxTicketsDto,
  TicketListDto,
  TicketsWithUsersSkuOrder,
} from './internat.dto';
import { mapTicketsToTicketListDto } from './internat.utils';

@Injectable()
export class InternatService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService,
    private readonly orderCancellationService: OrderCancellationService,
    private readonly orderCancelTokenService: OrderCancelTokenService,
  ) {}

  maxTickets = async (): Promise<MaxTicketsDto> => {
    const skuInternat = await this.prismaService.sku.findUnique({
      where: {
        skuCode: 'INTERNAT_2026',
      },
    });

    return { max: Math.min(skuInternat?.stock ?? 0, 6) };
  };

  processOrder = async (
    data: InternatCheckoutDto,
  ): Promise<InternatCheckoutResponseDto> => {
    const items = data.items as InternatTicketInputDto[];

    const produitInternat = await this.prismaService.product.findFirst({
      where: {
        skus: {
          some: {
            skuCode: 'INTERNAT_2026',
          },
        },
      },
      include: { skus: true },
    });

    const skuAdhesion = await this.prismaService.sku.findUnique({
      where: {
        skuCode: 'ADHESION_2026',
      },
      include: { product: true },
    });

    if (skuAdhesion == null || produitInternat == null) {
      throw new HttpException(
        'Could not find products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const skuInternatNoDrapNoGoodies = produitInternat.skus.find(
      (sku) => sku.skuCode === 'INTERNAT_2026',
    );
    const skuInternatDrapNoGoodies = produitInternat.skus.find(
      (sku) => sku.skuCode === 'INTERNAT_2026_DRAP',
    );
    const skuInternatNoDrapGoodies = produitInternat.skus.find(
      (sku) => sku.skuCode === 'INTERNAT_2026_GOODIES',
    );
    const skuInternatDrapGoodies = produitInternat.skus.find(
      (sku) => sku.skuCode === 'INTERNAT_2026_DRAP_GOODIES',
    );

    if (
      skuInternatDrapGoodies == null ||
      skuInternatDrapNoGoodies == null ||
      skuInternatNoDrapGoodies == null ||
      skuInternatNoDrapNoGoodies == null
    ) {
      throw new HttpException(
        'Could not find products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Aggregate internat variants into order-item buckets so pricing and stock stay centralized.
    const mapOrderItems = [
      { type: 'noDrapNoGoodies', value: 0 },
      { type: 'drapNoGoodies', value: 0 },
      { type: 'drapGoodies', value: 0 },
      { type: 'noDrapGoodies', value: 0 },
      { type: 'adhesion', value: 0 },
    ];

    // Fetch buyer user
    const buyer = await this.prismaService.user.upsert({
      where: { email: items[0].email },
      update: {},
      create: {
        email: items[0].email,
        lastname: items[0].surname,
        firstname: items[0].firstname,
        nickname: items[0].nickname,
      },
    });

    const { paymentIntentId, paymentIntentClientSecret, internatBasket } =
      await this.prismaService.$transaction(async (tx) => {
        // Create Order
        const order = await tx.order.create({
          data: {
            userId: buyer.id,
          },
        });

        // For each ticketDTO

        for (const item of items) {
          // Fetch or create user
          const user = await tx.user.upsert({
            where: { email: item.email },
            update: {},
            create: {
              email: item.email,
              lastname: item.surname,
              firstname: item.firstname,
              nickname: item.nickname,
            },
            include: {
              orders: {
                include: {
                  orderItems: {
                    include: { sku: true },
                  },
                },
              },
              tickets: {
                include: { order: true },
              },
            },
          });

          const hasTicket = user.tickets.some(
            (ticket) =>
              ticket.order.status === 'PAID' ||
              ticket.order.status === 'CASH_PAID',
          );
          if (hasTicket) {
            throw new HttpException(
              "Un des participants a déjà un ticket pour l'internat",
              HttpStatus.BAD_REQUEST,
            );
          }

          const userAdherent = user.orders.some(
            (order) =>
              (order.status === 'PAID' || order.status === 'CASH_PAID') &&
              order.orderItems.some(
                (orderItem) => orderItem.skuId === skuAdhesion.id,
              ),
          );

          // Fill mapOrderItem
          if (item.drap) {
            if (item.goodies) {
              mapOrderItems[2].value += 1;
            } else {
              mapOrderItems[1].value += 1;
            }
          } else {
            if (item.goodies) {
              mapOrderItems[3].value += 1;
            } else {
              mapOrderItems[0].value += 1;
            }
          }
          if (!userAdherent) {
            mapOrderItems[4].value += 1;
          }

          // Create ticket
          await tx.ticket.upsert({
            where: {
              pk_tickets: {
                userId: user.id,
                orderId: order.id,
              },
            },
            create: {
              userId: user.id,
              skuId: item.drap
                ? item.goodies
                  ? skuInternatDrapGoodies.id
                  : skuInternatDrapNoGoodies.id
                : item.goodies
                  ? skuInternatNoDrapGoodies.id
                  : skuInternatNoDrapNoGoodies.id,
              orderId: order.id,
            },
            update: {
              skuId: item.drap
                ? item.goodies
                  ? skuInternatDrapGoodies.id
                  : skuInternatDrapNoGoodies.id
                : item.goodies
                  ? skuInternatNoDrapGoodies.id
                  : skuInternatNoDrapNoGoodies.id,
            },
          });
        }

        // This basket is returned to the frontend recap and mirrors the final order items.
        const internatBasket: {
          name: string;
          unitPrice: Decimal;
          quantity: number;
        }[] = [];
        let totalPrice = new Decimal(0);

        if (mapOrderItems[0].value > 0) {
          const unitPrice =
            skuInternatNoDrapNoGoodies.priceOverride ??
            produitInternat.basePrice;
          const quantity = mapOrderItems[0].value;
          await tx.orderItem.create({
            data: {
              orderId: order.id,
              quantity: quantity,
              skuId: skuInternatNoDrapNoGoodies.id,
              unitPrice: unitPrice,
            },
          });
          totalPrice = totalPrice.plus(unitPrice.mul(quantity));
          internatBasket.push({
            name: 'Internat 2026',
            unitPrice: unitPrice,
            quantity: quantity,
          });
        }
        if (mapOrderItems[1].value > 0) {
          const unitPrice =
            skuInternatDrapNoGoodies.priceOverride ?? produitInternat.basePrice;
          const quantity = mapOrderItems[1].value;
          await tx.orderItem.create({
            data: {
              orderId: order.id,
              quantity: quantity,
              skuId: skuInternatDrapNoGoodies.id,
              unitPrice: unitPrice,
            },
          });
          totalPrice = totalPrice.plus(unitPrice.mul(mapOrderItems[1].value));
          internatBasket.push({
            name: 'Internat 2026 | Pack drap',
            unitPrice: unitPrice,
            quantity: quantity,
          });
        }
        if (mapOrderItems[2].value > 0) {
          const unitPrice =
            skuInternatDrapGoodies.priceOverride ?? produitInternat.basePrice;
          const quantity = mapOrderItems[2].value;
          await tx.orderItem.create({
            data: {
              orderId: order.id,
              quantity: quantity,
              skuId: skuInternatDrapGoodies.id,
              unitPrice: unitPrice,
            },
          });
          totalPrice = totalPrice.plus(unitPrice.mul(quantity));
          internatBasket.push({
            name: 'Internat 2026 | Packs drap & goodies',
            unitPrice: unitPrice,
            quantity: quantity,
          });
        }
        if (mapOrderItems[3].value > 0) {
          const unitPrice =
            skuInternatNoDrapGoodies.priceOverride ?? produitInternat.basePrice;
          const quantity = mapOrderItems[3].value;
          await tx.orderItem.create({
            data: {
              orderId: order.id,
              quantity: quantity,
              skuId: skuInternatNoDrapGoodies.id,
              unitPrice: unitPrice,
            },
          });
          totalPrice = totalPrice.plus(unitPrice.mul(quantity));
          internatBasket.push({
            name: 'Internat 2026 | Pack goodies',
            unitPrice: unitPrice,
            quantity: quantity,
          });
        }
        if (mapOrderItems[4].value > 0) {
          const unitPrice =
            skuAdhesion.priceOverride ?? skuAdhesion.product.basePrice;
          const quantity = mapOrderItems[4].value;
          await tx.orderItem.create({
            data: {
              orderId: order.id,
              quantity: quantity,
              skuId: skuAdhesion.id,
              unitPrice: unitPrice,
            },
          });
          totalPrice = totalPrice.plus(unitPrice.mul(quantity));
          internatBasket.push({
            name: 'Adhésion 2026',
            unitPrice: unitPrice,
            quantity: quantity,
          });
        }

        const paymentIntentClientSecret =
          await this.stripeService.createPaymentIntent(
          totalPrice.mul(100).toNumber(),
          buyer.email,
        );

        if (!paymentIntentClientSecret) {
          throw new InternalServerErrorException(
            'Impossible de creer le payment intent',
          );
        }

        const paymentIntentId = paymentIntentClientSecret.split('_secret')[0];

        await tx.order.update({
          where: {
            id: order.id,
          },
          data: {
            paymentIntentId,
          },
        });

        // Internat stock is reserved on the shared base SKU: one ticket always consumes one bed.
        const reservedTickets = items.length;
        const stockUpdate = await tx.sku.updateMany({
          where: {
            id: skuInternatNoDrapNoGoodies.id,
            stock: {
              gte: reservedTickets,
            },
          },
          data: {
            stock: {
              decrement: reservedTickets,
            },
          },
        });

        if (stockUpdate.count === 0) {
          throw new BadRequestException(
            'Insufficient stock for Internat 2026 (INTERNAT_2026)',
          );
        }

        return { paymentIntentId, paymentIntentClientSecret, internatBasket };
      });

    return {
      paymentIntent: paymentIntentClientSecret,
      cancelToken: this.orderCancelTokenService.createToken(paymentIntentId),
      basket: internatBasket,
    };
  };

  async cancelOrder(paymentIntentId: string, cancelToken?: string): Promise<void> {
    this.orderCancelTokenService.assertValidToken(paymentIntentId, cancelToken);

    await this.orderCancellationService.cancelPendingOrderByPaymentIntentId(
      paymentIntentId,
    );
  }

  async getList(): Promise<TicketListDto[]> {
    const tickets: TicketsWithUsersSkuOrder[] =
      await this.prismaService.ticket.findMany({
        include: {
          user: true,
          sku: true,
          order: true,
        },
        where: {
          order: {
            status: { in: PAID_STATUSES },
          },
        },
        orderBy: {
          order: {
            createdAt: 'desc',
          },
        },
      });

    return mapTicketsToTicketListDto(tickets);
  }
}
