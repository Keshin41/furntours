import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export type UpdateProductDto = {
  name: string;
  basePrice: string;
  virtual: boolean;
  description?: string;
  category?: string;
  imageUrl?: string;
};

const CreateProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  basePrice: z.string().min(1),
  category: z.string().optional(),
  imageUrl: z.string().optional(),
  virtual: z.boolean().default(false),
});

export class CreateProductDto extends createZodDto(CreateProductSchema) {}
