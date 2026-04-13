import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateSkuSchema = z.object({
  skuCode: z.string().min(1),
  priceOverride: z.number().optional(),
  stock: z.number().int().nonnegative(),
  trackStock: z.boolean(),
});

export class UpdateSkuDto extends createZodDto(UpdateSkuSchema) {}
