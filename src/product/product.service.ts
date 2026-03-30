import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(isVirtual?: boolean) {
    const whereClause = isVirtual !== undefined ? { virtual: isVirtual } : {};

    return this.prisma.product.findMany({
      where: whereClause,
      include: {
        skus: {
          include: {
            options: {
              include: {
                optionValue: {
                  include: {
                    optionType: true,
                  },
                },
              },
            },
          },
        },
        optionTypes: {
          include: {
            optionValues: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        skus: {
          include: {
            options: {
              include: {
                optionValue: {
                  include: {
                    optionType: true,
                  },
                },
              },
            },
          },
        },
        optionTypes: {
          include: {
            optionValues: true,
          },
        },
      },
    });
  }
}
