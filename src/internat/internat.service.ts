import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

export interface TicketDTO {
  surname: string;
  firstname: string;
  nickname: string;
  email: string;
  option: boolean;
  payeur: boolean;
}

@Injectable()
export class InternatService {
  constructor(private prismaService: PrismaService){}

  manageTest = async (data: any) => {
    const items = data.items as TicketDTO[];
    console.log(items);
    // creer l'order globale
    // Pour chaque ticket
      // Create user ou fetch
      // creer un orderItem
      // creer un ticket
    //paiement

    // Fetch internat skus 2026
    const skuInternatBasic = await this.prismaService.sku.findUnique({
      where: { id: ''}
    });
    const skuInternatOptionDrap = await this.prismaService.sku.findUnique({
      where: { id: ''}
    });
    const skuInternatBasicAdherent = await this.prismaService.sku.findUnique({
      where: { id: ''}
    });
    const skuInternatOptionDrapAdherent = await this.prismaService.sku.findUnique({
      where: { id: ''}
    });

    // Create mapOrder (for orderItems)
    const mapOrder = [
      {type: 'basic', value: 0},
      {type: 'drap', value: 0},
      {type: 'basicAdherent', value: 0},
      {type: 'drapAdherent', value: 0},
    ]

    // Create Order
    const order = await this.prismaService.order.create({
      data: {
        userId: '',
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
      });

      // todo: Fetch adherent ()
      const userAdherent = false;

      if (item.option) {
        if (userAdherent) {
          mapOrder[3].value += 1;
        } else {
          mapOrder[1].value += 1;
        }
      } else {
        if (userAdherent) {
          mapOrder[2].value += 1;
        } else {
          mapOrder[0].value += 1;
        }
      }

      const ticket = await this.prismaService.ticket.create({
        data: {
          userId: user.id,
          orderItemId: item.option ? skuInternatOptionDrap?.id : skuInternatBasic?.id,
          //skuId: item.option ? skuInternatOptionDrap?.id : skuInternatBasic?.id,
        }
      })
    }

    // Create orderIds

    if (mapOrder[0].value > 0)
      this.prismaService.orderItem.create({
        data: {
          orderId: order.id,
          quantity: mapOrder[0].value,
          skuId: skuInternatBasic.id,
          unitPrice : skuInternatBasic?.priceOverride,
        }
      });

    if (mapOrder[1].value > 0)
      this.prismaService.orderItem.create({
        data: {
          orderId: order.id,
          quantity: mapOrder[1].value,
          skuId: skuInternatOptionDrap.id,
          unitPrice : skuInternatOptionDrap?.priceOverride,
        }
      });

    if (mapOrder[2].value > 0)
      this.prismaService.orderItem.create({
        data: {
          orderId: order.id,
          quantity: mapOrder[2].value,
          skuId: skuInternatBasicAdherent.id,
          unitPrice : skuInternatBasicAdherent?.priceOverride,
        }
      });

    if (mapOrder[3].value > 0)
      this.prismaService.orderItem.create({
        data: {
          orderId: order.id,
          quantity: mapOrder[3].value,
          skuId: skuInternatOptionDrapAdherent.id,
          unitPrice : skuInternatOptionDrapAdherent?.priceOverride,
        }
      });
  }
}
