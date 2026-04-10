import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateOrderSchema = z.object({
  user: z.object({
    email: z.email(),
    firstname: z.string(),
    lastname: z.string(),
    nickname: z.string(),
    address: z.string(),
    postalCode: z.string().length(5),
    city: z.string(),
  }),
  basket: z.array(
    z.object({
      skuId: z.string(),
      quantity: z.number().int().positive(),
    }),
  ),
});

export class CreateOrderDto extends createZodDto(CreateOrderSchema) {}
