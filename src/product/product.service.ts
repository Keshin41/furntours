import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { syncSkus } from 'src/sku/sku.helper';
import { CreateProductDto, UpdateProductDto } from './product.type';

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

  updateById(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: {
        name: updateProductDto.name,
        basePrice: updateProductDto.basePrice,
        virtual: updateProductDto.virtual,
        description: updateProductDto.description,
        category: updateProductDto.category,
        ...(updateProductDto.imageUrl !== undefined
          ? { imageUrl: updateProductDto.imageUrl.trim() || null }
          : {}),
      },
    });
  }

  createProduct(dto: CreateProductDto) {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: dto.name,
          description: dto.description,
          basePrice: dto.basePrice,
          category: dto.category,
          imageUrl: dto.imageUrl?.trim() || null,
          virtual: dto.virtual,
        },
      });

      // Every new product starts with a default SKU representing its stock
      await syncSkus(tx, product.id);

      return tx.product.findUnique({
        where: { id: product.id },
        include: { skus: true },
      });
    });
  }
}
