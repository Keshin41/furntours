import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateOptionTypeSchema = z.object({
  name: z.string().min(1),
  values: z.array(z.string().min(1)).min(2),
});

const UpdateOptionTypeSchema = z.object({
  name: z.string().min(1),
});

const CreateOptionValueSchema = z.object({
  value: z.string().min(1),
});

const UpdateOptionValueSchema = z.object({
  value: z.string().min(1),
});

export class CreateOptionTypeDto extends createZodDto(CreateOptionTypeSchema) {}
export class UpdateOptionTypeDto extends createZodDto(UpdateOptionTypeSchema) {}
export class CreateOptionValueDto extends createZodDto(
  CreateOptionValueSchema,
) {}
export class UpdateOptionValueDto extends createZodDto(
  UpdateOptionValueSchema,
) {}
