import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/client';
import { StripeService } from 'src/payment/stripe.service';
import { PrismaService } from 'src/prisma/prisma.service';

export interface TicketDTO {
  surname: string;
  firstname: string;
  nickname: string;
  email: string;
  drap: boolean;
  goodies: boolean;
}

@Injectable()
export class InternatService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  maxTickets = async () => {
    const skuInternat = await this.prismaService.sku.findUnique({
      where: {
        skuCode: 'INTERNAT_2026',
      },
    });
    if (skuInternat?.stock) {
      const max = Math.min(skuInternat.stock, 4);
      return { max: max };
    }
  };

  processOrder = async (data: any) => {
    const items = data.items as TicketDTO[];

    console.log('data', items);

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

    // Create mapOrder (for orderItems)
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

    const { paymentIntent, internatBasket } =
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
            },
          });
          console.log(user);

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

        // Create orderIds
        console.log('map', mapOrderItems);

        const internatBasket: {
          name: string;
          unitPrice: Decimal;
          quantity: number;
        }[] = [];
        let totalPrice = new Decimal(0);

        if (mapOrderItems[0].value > 0) {
          console.log('creer skuInternatNoDrapNoGoodies');
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
          console.log('creer skuInternatDrapNoGoodies');
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
          console.log('creer skuInternatDrapGoodies');
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
          console.log('creer skuInternatNoDrapGoodies');
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
          console.log('creer skuAdhesion');
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

        const paymentIntent = await this.stripeService.createPaymentIntent(
          totalPrice.mul(100).toNumber(),
          buyer.email,
        );

        await tx.order.update({
          where: {
            id: order.id,
          },
          data: {
            paymentIntentId: paymentIntent?.split('_secret')[0],
          },
        });

        const newStock = skuInternatNoDrapNoGoodies.stock - items.length;
        if (newStock >= 0) {
          await tx.sku.update({
            where: {
              id: skuInternatNoDrapNoGoodies.id,
            },
            data: {
              stock: newStock,
            },
          });
        } else {
          throw new HttpException(
            "Ce produit n'est plus disponible à la vente",
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        return { paymentIntent, internatBasket };
      });

    console.log('data renvoyees', { paymentIntent, internatBasket });

    return { paymentIntent: paymentIntent, basket: internatBasket };
  };
}
