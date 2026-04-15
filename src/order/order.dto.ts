import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const ManualOrderItemSchema = z.object({
  skuId: z.string().min(1),
  quantity: z.number().int().positive(),
});

const ManualOrderBuyerSchema = z.object({
  email: z.email(),
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  nickname: z.string().min(1),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
});

const CreateManualOrderSchema = z.object({
  buyer: ManualOrderBuyerSchema,
  items: z.array(ManualOrderItemSchema).min(1),
  paymentMethod: z.enum(['TPE', 'CASH']),
  isPaid: z.boolean().default(true),
});

export class CreateManualOrderDto extends createZodDto(
  CreateManualOrderSchema,
) {}
