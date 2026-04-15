import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateSkuDto } from './sku.dto';

@Injectable()
export class SkuService {
  constructor(private readonly prisma: PrismaService) {}

  updateById(id: string, dto: UpdateSkuDto) {
    return this.prisma.sku.update({
      where: { id },
      data: {
        skuCode: dto.skuCode,
        priceOverride: dto.priceOverride,
        stock: dto.stock,
        trackStock: dto.trackStock,
        ...(dto.imageUrl !== undefined
          ? { imageUrl: dto.imageUrl.trim() || null }
          : {}),
      },
    });
  }
}
