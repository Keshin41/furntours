import { PrismaClient } from 'src/generated/prisma/client';

type PrismaTransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

/**
 * Recomputes the SKU set for a product so it exactly matches the cartesian
 * product of its option values.
 *
 * - No option types → ensure exactly one default SKU exists (no option links).
 * - ≥1 option types → cartesian product; delete the default SKU if present.
 * - Existing SKUs whose combination still exists are kept as-is
 *   (priceOverride, stock, skuCode, imageUrl are preserved).
 * - New combinations get a fresh SKU with default values.
 * - Orphaned SKUs (combinations that no longer exist) are deleted.
 */
export async function syncSkus(
  prisma: PrismaTransactionClient,
  productId: string,
): Promise<void> {
  // 1. Load all option types + their values for this product
  const optionTypes = await prisma.optionType.findMany({
    where: { productId },
    include: { optionValues: true },
    orderBy: { createdAt: 'asc' },
  });

  // ── No option types: ensure a single default SKU (product-level stock) ──────
  if (optionTypes.length === 0) {
    const existing = await prisma.sku.findFirst({ where: { productId } });
    if (!existing) {
      await prisma.sku.create({
        data: {
          productId,
          skuCode: `${productId.slice(0, 8).toUpperCase()}-DEFAULT`,
          stock: 0,
          trackStock: true,
        },
      });
    }
    return;
  }

  // ── Has option types: remove the default SKU if it still exists ──────────────
  // The default SKU has no SkuOptionValue rows linked to it.
  const allSkus = await prisma.sku.findMany({
    where: { productId },
    include: { options: true },
  });
  const defaultSkuIds = allSkus
    .filter((sku) => sku.options.length === 0)
    .map((sku) => sku.id);
  if (defaultSkuIds.length > 0) {
    await prisma.sku.deleteMany({ where: { id: { in: defaultSkuIds } } });
  }

  // If any option type has zero values, cartesian product is empty — bail out
  if (optionTypes.some((ot) => ot.optionValues.length === 0)) return;

  // 2. Compute the cartesian product of all option value id sets
  //    e.g. [[red, blue], [S, M, L]] → [[red,S],[red,M],[red,L],[blue,S],…]
  const valueSets = optionTypes.map((ot) => ot.optionValues.map((ov) => ov.id));
  const combinations = cartesian(valueSets);

  // 3. Load existing SKUs with their option value links (excluding default SKUs
  //    already deleted above — only option-linked SKUs remain at this point)
  const existingSkus = await prisma.sku.findMany({
    where: { productId },
    include: { options: true },
  });

  // Build a lookup: sorted option-value-id key → existing SKU
  const existingSkuMap = new Map<string, (typeof existingSkus)[0]>();
  for (const sku of existingSkus) {
    const key = skuKey(sku.options.map((o) => o.optionValueId));
    existingSkuMap.set(key, sku);
  }

  // 4. Determine which combinations are new and which existing SKUs are orphaned
  const desiredKeys = new Set<string>();
  for (const combo of combinations) {
    desiredKeys.add(skuKey(combo));
  }

  const orphanedSkuIds = existingSkus
    .filter((sku) => {
      const key = skuKey(sku.options.map((o) => o.optionValueId));
      return !desiredKeys.has(key);
    })
    .map((sku) => sku.id);

  // 5. Delete orphaned SKUs (cascade deletes SkuOptionValue rows via Prisma)
  if (orphanedSkuIds.length > 0) {
    await prisma.skuOptionValue.deleteMany({
      where: { skuId: { in: orphanedSkuIds } },
    });
    await prisma.sku.deleteMany({
      where: { id: { in: orphanedSkuIds } },
    });
  }

  // 6. Create missing SKUs
  for (const combo of combinations) {
    const key = skuKey(combo);
    if (existingSkuMap.has(key)) continue; // already exists, keep it

    const sku = await prisma.sku.create({
      data: {
        productId,
        skuCode: generateSkuCode(productId, combo),
        stock: 0,
        trackStock: true,
      },
    });

    await prisma.skuOptionValue.createMany({
      data: combo.map((optionValueId) => ({
        skuId: sku.id,
        optionValueId,
      })),
    });
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Sorted join of option value ids — order-independent fingerprint for a SKU */
function skuKey(optionValueIds: string[]): string {
  return [...optionValueIds].sort().join('|');
}

/** Cartesian product of N arrays */
function cartesian(sets: string[][]): string[][] {
  return sets.reduce<string[][]>(
    (acc, set) => acc.flatMap((combo) => set.map((val) => [...combo, val])),
    [[]],
  );
}

/** Deterministic default SKU code — can be edited by the user afterwards */
function generateSkuCode(productId: string, optionValueIds: string[]): string {
  const suffix = [...optionValueIds]
    .sort()
    .map((id) => id.slice(0, 4).toUpperCase())
    .join('-');
  return `${productId.slice(0, 4).toUpperCase()}-${suffix}`;
}
