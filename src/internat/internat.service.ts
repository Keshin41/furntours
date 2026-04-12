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

@Injectable()
export class InternatService {
  constructor(private prismaService: PrismaService){}

  //todo: gestion stock

  manageTest = async (data: any) => {
    const items = data.items as TicketDTO[];
    console.log(items);
    // creer l'order globale
    // Pour chaque ticket
      // Create user ou fetch
      // creer un orderItem
      // creer un ticket
    //paiement
    
    const produitInternat = await this.prismaService.product.findFirst({
      where: { skus: {
        some: {
          skuCode: 'INTERNAT_2026',
        }
      }},
      include: { skus: true },
    });

    const skuAdhesion = await this.prismaService.sku.findUnique({
      where: {
        skuCode: 'ADHESION_2026',
      },
      include: { product: true },
    });

    if (skuAdhesion == null || produitInternat == null ) {
      throw new HttpException('Could not find products', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const skuInternatNoDrapNoGoodies = produitInternat.skus.find((sku) => {sku.skuCode === ''});
    const skuInternatDrapNoGoodies = produitInternat.skus.find((sku) => {sku.skuCode === ''});
    const skuInternatNoDrapGoodies = produitInternat.skus.find((sku) => {sku.skuCode === ''});
    const skuInternatDrapGoodies = produitInternat.skus.find((sku) => {sku.skuCode === ''});

    if (skuInternatDrapGoodies == null || skuInternatDrapNoGoodies == null || skuInternatNoDrapGoodies == null || skuInternatNoDrapNoGoodies == null) {
      throw new HttpException('Could not find products', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Create mapOrder (for orderItems)
    const mapOrderItems = [
      {type: 'noDrapNoGoodies', value: 0},
      {type: 'drapNoGoodies', value: 0},
      {type: 'drapGoodies', value: 0},
      {type: 'noDrapGoodies', value: 0},
      {type: 'adhesion', value: 0},
    ]

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

    // Create Order
    const order = await this.prismaService.order.create({
      data: {
        userId: buyer.id,
      }
    });

    // For each ticketDTO

    for (const item of items) {
      // Fetch or create user
      const user = await this.prismaService.user.upsert({
        where: { email: item.email },
        update: {},
        create: {
          email: item.email,
          lastname: item.surname,
          firstname: item.firstname,
          nickname: item.nickname,
        },
        include: { orders: {
          include: { orderItems: {
            include: { sku: true }
          } }
        } }
      });

      // todo: Fetch adherent ()
      const userAdherent = user.orders.some(order => {
        order.orderItems.some(orderItem => {
          orderItem.sku == skuAdhesion;
        })
      })

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
      await this.prismaService.ticket.create({
        data: {
          userId: user.id,
          skuId: item.drap ? (item.goodies ? skuInternatDrapGoodies.id : skuInternatDrapNoGoodies.id) : (item.goodies ? skuInternatNoDrapGoodies.id : skuInternatNoDrapNoGoodies.id),
        }
      })
    }

    // Create orderIds

    if (mapOrderItems[0].value > 0)
      this.prismaService.orderItem.create({
        data: {
          orderId: order.id,
          quantity: mapOrderItems[0].value,
          skuId: skuInternatNoDrapNoGoodies.id,
          unitPrice : skuInternatNoDrapNoGoodies.priceOverride ?? produitInternat.basePrice,
        }
      });

    if (mapOrderItems[1].value > 0)
      this.prismaService.orderItem.create({
        data: {
          orderId: order.id,
          quantity: mapOrderItems[1].value,
          skuId: skuInternatDrapNoGoodies.id,
          unitPrice : skuInternatDrapNoGoodies.priceOverride ?? produitInternat.basePrice,
        }
      });

    if (mapOrderItems[2].value > 0)
      this.prismaService.orderItem.create({
        data: {
          orderId: order.id,
          quantity: mapOrderItems[2].value,
          skuId: skuInternatDrapGoodies.id,
          unitPrice : skuInternatDrapGoodies.priceOverride ?? produitInternat.basePrice
        }
      });

    if (mapOrderItems[3].value > 0)
      this.prismaService.orderItem.create({
        data: {
          orderId: order.id,
          quantity: mapOrderItems[3].value,
          skuId: skuInternatNoDrapGoodies.id,
          unitPrice : skuInternatNoDrapGoodies.priceOverride ?? produitInternat.basePrice,
        }
      });
    if (mapOrderItems[4].value > 0)
      this.prismaService.orderItem.create({
        data: {
          orderId: order.id,
          quantity: mapOrderItems[4].value,
          skuId: skuAdhesion.id,
          unitPrice : skuAdhesion.priceOverride ?? skuAdhesion.product.basePrice,
        }
      });
  }
}
