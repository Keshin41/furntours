import { Injectable, NotFoundException } from '@nestjs/common';
import { syncSkus } from 'src/sku/sku.helper';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateOptionTypeDto,
  CreateOptionValueDto,
  UpdateOptionTypeDto,
  UpdateOptionValueDto,
} from './option.dto';

@Injectable()
export class OptionService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Option Types ────────────────────────────────────────────────────────────

  /**
   * Creates an option type with its initial values (minimum 2 enforced by DTO),
   * then recomputes SKUs for the product.
   */
  async createOptionType(productId: string, dto: CreateOptionTypeDto) {
    await this.assertProductExists(productId);

    const optionType = await this.prisma.$transaction(async (tx) => {
      const created = await tx.optionType.create({
        data: {
          productId,
          name: dto.name,
          optionValues: {
            create: dto.values.map((value) => ({ value })),
          },
        },
        include: { optionValues: true },
      });

      await syncSkus(tx, productId);
      return created;
    });

    return optionType;
  }

  async updateOptionType(optionTypeId: string, dto: UpdateOptionTypeDto) {
    await this.assertOptionTypeExists(optionTypeId);

    return this.prisma.optionType.update({
      where: { id: optionTypeId },
      data: { name: dto.name },
    });
  }

  /**
   * Deletes an option type and all its values, then recomputes SKUs.
   * SKUs that referenced any of the deleted values are removed.
   */
  async deleteOptionType(optionTypeId: string) {
    const optionType = await this.assertOptionTypeExists(optionTypeId);

    await this.prisma.$transaction(async (tx) => {
      // Unlink SKUs that used any value from this option type
      const valueIds = (
        await tx.optionValue.findMany({
          where: { optionTypeId },
          select: { id: true },
        })
      ).map((v) => v.id);

      if (valueIds.length > 0) {
        const affectedSkuIds = (
          await tx.skuOptionValue.findMany({
            where: { optionValueId: { in: valueIds } },
            select: { skuId: true },
          })
        ).map((r) => r.skuId);

        const uniqueSkuIds = [...new Set(affectedSkuIds)];

        if (uniqueSkuIds.length > 0) {
          await tx.skuOptionValue.deleteMany({
            where: { skuId: { in: uniqueSkuIds } },
          });
          await tx.sku.deleteMany({
            where: { id: { in: uniqueSkuIds } },
          });
        }
      }

      // Delete values and option type (cascade handles optionValues)
      await tx.optionValue.deleteMany({ where: { optionTypeId } });
      await tx.optionType.delete({ where: { id: optionTypeId } });

      // Recompute remaining SKUs
      await syncSkus(tx, optionType.productId);
    });
  }

  // ── Option Values ───────────────────────────────────────────────────────────

  /**
   * Adds a value to an existing option type, then creates the missing SKUs
   * that include this new value (existing SKUs are untouched).
   */
  async createOptionValue(optionTypeId: string, dto: CreateOptionValueDto) {
    const optionType = await this.assertOptionTypeExists(optionTypeId);

    const optionValue = await this.prisma.$transaction(async (tx) => {
      const created = await tx.optionValue.create({
        data: { optionTypeId, value: dto.value },
      });

      await syncSkus(tx, optionType.productId);
      return created;
    });

    return optionValue;
  }

  async updateOptionValue(optionValueId: string, dto: UpdateOptionValueDto) {
    await this.assertOptionValueExists(optionValueId);

    return this.prisma.optionValue.update({
      where: { id: optionValueId },
      data: { value: dto.value },
    });
  }

  /**
   * Deletes a value and removes every SKU that referenced it,
   * then recomputes the remaining SKU set.
   */
  async deleteOptionValue(optionValueId: string) {
    const optionValue = await this.assertOptionValueExists(optionValueId);
    const optionType = await this.assertOptionTypeExists(
      optionValue.optionTypeId,
    );

    await this.prisma.$transaction(async (tx) => {
      // Find and delete SKUs that use this value
      const affectedSkuIds = (
        await tx.skuOptionValue.findMany({
          where: { optionValueId },
          select: { skuId: true },
        })
      ).map((r) => r.skuId);

      if (affectedSkuIds.length > 0) {
        await tx.skuOptionValue.deleteMany({
          where: { skuId: { in: affectedSkuIds } },
        });
        await tx.sku.deleteMany({
          where: { id: { in: affectedSkuIds } },
        });
      }

      await tx.optionValue.delete({ where: { id: optionValueId } });

      // Recompute remaining SKUs
      await syncSkus(tx, optionType.productId);
    });
  }

  // ── Guards ──────────────────────────────────────────────────────────────────

  private async assertProductExists(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);
    return product;
  }

  private async assertOptionTypeExists(optionTypeId: string) {
    const optionType = await this.prisma.optionType.findUnique({
      where: { id: optionTypeId },
    });
    if (!optionType)
      throw new NotFoundException(`OptionType ${optionTypeId} not found`);
    return optionType;
  }

  private async assertOptionValueExists(optionValueId: string) {
    const optionValue = await this.prisma.optionValue.findUnique({
      where: { id: optionValueId },
    });
    if (!optionValue)
      throw new NotFoundException(`OptionValue ${optionValueId} not found`);
    return optionValue;
  }
}
